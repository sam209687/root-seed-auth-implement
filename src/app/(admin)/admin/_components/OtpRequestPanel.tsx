// src/app/(admin)/admin/dashboard/_components/OtpRequestPanel.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Message, MessageType, MessageStatus } from '../../../../lib/models/Message';
import { useOfflineMessages } from '../../../../hooks/useOfflineMessages';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { generateOtp } from '../../../../lib/utils'; // Assuming you have an OTP generation utility

interface OtpRequestPanelProps {
  isDarkMode: boolean;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
  primaryColor: string;
}

export const OtpRequestPanel: React.FC<OtpRequestPanelProps> = ({
  isDarkMode,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
  primaryColor,
}) => {
  const { messages, updateMessageStatus } = useOfflineMessages();
  const [generatingOtpForId, setGeneratingOtpForId] = React.useState<string | null>(null);

  const textColor = isDarkMode ? darkTextColor : lightTextColor;
  const cardBg = isDarkMode ? darkCardColor : lightCardColor;

  // Filter for pending OTP requests
  const pendingOtpRequests = messages.filter(
    (msg) => msg.type === MessageType.OtpRequest && msg.status === MessageStatus.Pending
  );

  const handleGenerateOtp = async (message: Message) => {
    if (!message._id) {
      toast.error("Error", { description: "Message ID is missing." });
      return;
    }

    setGeneratingOtpForId(message._id.toString());
    try {
      const otp = generateOtp(); // Use your existing OTP generation function
      console.log(`Generated OTP for ${message.senderName || message.senderId}: ${otp}`); // Log for debugging

      // Update the message in the local system to be an OTP_RESPONSE
      await updateMessageStatus(message._id.toString(), MessageStatus.Generated, otp);

      // Now, send this OTP back to the cashier (by creating a new message with type OTP_RESPONSE)
      // The updateMessageStatus will also handle marking the original request as 'generated'
      // and the new OTP_RESPONSE will be picked up by the cashier's hook.
      await updateMessageStatus(
          message._id.toString(), // Update the original request to mark it as generated
          MessageStatus.Generated,
          otp
      );

      // Create a new message for the recipient (cashier) as an OTP_RESPONSE
      await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              type: MessageType.OtpResponse,
              senderId: 'admin', // Admin's identifier
              recipientId: message.senderId, // Cashier's ID
              otp: otp,
              status: MessageStatus.Pending, // Pending until cashier acknowledges receipt
              timestamp: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP valid for 5 minutes
          })
      });

      toast.success("OTP Sent to Cashier!", {
        description: `Generated OTP ${otp} for ${message.senderName || message.senderId}.`,
      });

    } catch (error) {
      console.error("Error generating/sending OTP:", error);
      toast.error("Failed to generate and send OTP.");
    } finally {
      setGeneratingOtpForId(null);
    }
  };

  return (
    <Card
      className="col-span-1 lg:col-span-2 shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: cardBg, borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'transparent' }}
    >
      <CardHeader>
        <CardTitle style={{ color: textColor }}>Incoming OTP Requests</CardTitle>
        <CardDescription style={{ color: textColor }}>
          Requests from cashiers to change their password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingOtpRequests.length === 0 ? (
          <p style={{ color: textColor }} className="text-center text-muted-foreground">
            No pending OTP requests.
          </p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {pendingOtpRequests.map((request) => (
              <div
                key={request._id?.toString()}
                className="flex items-center justify-between p-3 border rounded-md"
                style={{ borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'hsl(0, 0%, 90%)' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: textColor }}>
                    Cashier: {request.senderName || request.senderId}
                  </p>
                  <p className="text-sm text-muted-foreground" style={{ color: textColor }}>
                    Requested at: {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleGenerateOtp(request)}
                  isLoading={generatingOtpForId === request._id?.toString()}
                  disabled={generatingOtpForId !== null}
                  className={`bg-gradient-to-r text-white ${
                    generatingOtpForId === request._id?.toString()
                      ? 'from-gray-400 to-gray-500 cursor-not-allowed'
                      : `from-${primaryColor} to-${primaryColor} hover:from-${primaryColor} hover:to-${primaryColor}`
                  } transition-all duration-300`}
                >
                  {generatingOtpForId === request._id?.toString() ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate OTP"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};