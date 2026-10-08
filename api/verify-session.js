/**
 * Decoy Session Verification Endpoint
 * Returns a 200 OK acknowledgement to obfuscate traffic in Network activity
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const randomAck = 'ack_' + Math.random().toString(36).substring(2, 10);

  return res.status(200).json({
    success: true,
    status: 'acknowledged',
    code: 'SEC_OK_200',
    ack: randomAck,
    timestamp: Date.now()
  });
}
