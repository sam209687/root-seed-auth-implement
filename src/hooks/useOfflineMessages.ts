// src/hooks/useOfflineMessages.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Message, MessageType, MessageStatus } from '../lib/models/Message'; // Ensure these are correctly imported

interface UseOfflineMessagesHook {
  messages: Message[];
  addMessage: (message: Partial<Message>) => Promise<void>;
  updateMessageStatus: (id: string, status: MessageStatus, otp?: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  subscribeToMessages: (callback: (message: Message) => void) => void;
  unsubscribeFromMessages: (callback: (message: Message) => void) => void;
}

// A simple in-memory store for callbacks
const messageSubscribers: ((message: Message) => void)[] = [];

// Polling interval (adjust as needed for responsiveness vs. resource usage)
const POLLING_INTERVAL = 2000; // Poll every 2 seconds

export const useOfflineMessages = (): UseOfflineMessagesHook => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPolling, setIsPolling] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const fetchedMessages: Message[] = await response.json();
        // Filter out expired OTP requests
        const activeMessages = fetchedMessages.filter(msg =>
            !(msg.type === MessageType.OtpRequest && msg.expiresAt && new Date(msg.expiresAt) < new Date())
        );
        setMessages(activeMessages);
        // Notify subscribers about new/updated messages
        activeMessages.forEach(msg => {
            const existingMsg = messages.find(m => m._id?.toString() === msg._id?.toString());
            if (!existingMsg || JSON.stringify(existingMsg) !== JSON.stringify(msg)) {
                messageSubscribers.forEach(callback => callback(msg));
            }
        });
      } else {
        console.error('Failed to fetch messages:', response.statusText);
        toast.error('Failed to load messages.', { description: response.statusText });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Network error fetching messages.');
    }
  }, [messages]); // messages in dependency array to trigger re-run for comparison

  useEffect(() => {
    // Start polling when component mounts
    setIsPolling(true);
    const intervalId = setInterval(fetchMessages, POLLING_INTERVAL);

    return () => {
      // Stop polling when component unmounts
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [fetchMessages]);

  const addMessage = useCallback(async (message: Partial<Message>) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      if (response.ok) {
        const newMessage: Message = await response.json();
        setMessages(prev => [...prev, newMessage]);
        toast.success("Message sent!");
        fetchMessages(); // Re-fetch to ensure sync
      } else {
        console.error('Failed to add message:', response.statusText);
        toast.error('Failed to send message.', { description: response.statusText });
      }
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Network error sending message.');
    }
  }, [fetchMessages]);

  const updateMessageStatus = useCallback(async (id: string, status: MessageStatus, otp?: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, otp }),
      });
      if (response.ok) {
        toast.success("Message updated!");
        fetchMessages(); // Re-fetch to ensure sync
      } else {
        console.error('Failed to update message:', response.statusText);
        toast.error('Failed to update message status.', { description: response.statusText });
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Network error updating message.');
    }
  }, [fetchMessages]);

  const subscribeToMessages = useCallback((callback: (message: Message) => void) => {
    messageSubscribers.push(callback);
  }, []);

  const unsubscribeFromMessages = useCallback((callback: (message: Message) => void) => {
    const index = messageSubscribers.indexOf(callback);
    if (index > -1) {
      messageSubscribers.splice(index, 1);
    }
  }, []);


  return { messages, addMessage, updateMessageStatus, fetchMessages, subscribeToMessages, unsubscribeFromMessages };
};