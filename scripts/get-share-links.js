// Generates Google Drive shareable links from file IDs
const files = [
  { name: 'ChipChip Delivery Fee Strategy & Copy.md', id: '11xOeCtJ8N9yUHdvLCh2tpH70CYCtVcZb' },
  { name: 'ChipChip_7Day_Content_Calendar.csv', id: '1IxFHVL674TnGMTPMEk82pk0M1UKlLweu' },
  { name: 'Zarely.co Complete AI Automation Plan.md', id: '1H3kIPo3yV2HYHfDzRgXcVYzpf1lvpRDb' },
  { name: 'The Ultimate Zarely.co AI Automation Playbook.md', id: '1bXuAYgL8YQgY0r99iZBE8gYbJV82uPQ-' }
];

files.forEach(f => {
  console.log(`<file href="https://drive.google.com/file/d/${f.id}/view" target="_blank">${f.name}</file>`);
});
