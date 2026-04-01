export async function sendTelegramApproval(highValueIssues: any[]) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn("Telegram configuration missing, skipping notification");
    return;
  }

  const message = `🔴 *HIGH VALUE BOUNTIES FOUND:*\n\n` +
    highValueIssues.map(i => 
      `💰 $${i.bounty}: ${i.title}\n` +
      `📦 ${i.repo}#${i.number}\n`
    ).join('\n') +
    `\nReply \`/approve_${highValueIssues[0].number}\` to proceed or \`/deny\``;

  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error("Failed to send telegram notification", err);
  }
}
