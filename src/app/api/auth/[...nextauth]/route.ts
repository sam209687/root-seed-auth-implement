// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "../../../../lib/auth"; // Import 'handlers' from your auth.ts

export const { GET, POST } = handlers; // Destructure GET and POST from 'handlers'