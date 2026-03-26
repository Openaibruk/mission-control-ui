const prompt = process.argv.slice(2).join(' ');

if (!prompt) {
  console.error('Usage: node lovable-builder.js "Your prompt here"');
  process.exit(1);
}

const encodedPrompt = encodeURIComponent(prompt);
const lovableUrl = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

console.log('\n🚀 Lovable Build URL Generated:\n');
console.log(lovableUrl);
console.log('\nClick the link above to instantly start building the app in Lovable!');
