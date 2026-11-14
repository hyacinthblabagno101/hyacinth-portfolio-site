/**
 * Icons for the Tools section, matched by the tool's name in src/data/tools.json.
 * - "icon": a logo from the Simple Icons library, drawn in the brand's own color.
 * - "mono": brands that aren't in Simple Icons (Adobe, Microsoft and a few others) get a small
 *   lettered tile in their brand colors, the same style their app icons use.
 * A tool with no entry here gets a plain tile with its first letter.
 */
import * as si from 'simple-icons';

type SimpleIcon = { path: string; hex: string };
export type ToolIcon =
  | { type: 'icon'; path: string; color: string }
  | { type: 'mono'; text: string; bg: string; fg: string };

const icon = (i: SimpleIcon, color?: string): ToolIcon => ({ type: 'icon', path: i.path, color: color ?? `#${i.hex}` });
const mono = (text: string, bg: string, fg = '#ffffff'): ToolIcon => ({ type: 'mono', text, bg, fg });

const map: Record<string, ToolIcon> = {
  Instagram: icon(si.siInstagram),
  TikTok: icon(si.siTiktok),
  Facebook: icon(si.siFacebook),
  YouTube: icon(si.siYoutube),
  Pinterest: icon(si.siPinterest),
  Threads: icon(si.siThreads),
  X: icon(si.siX),
  WhatsApp: icon(si.siWhatsapp),
  'Meta Business Suite': icon(si.siMeta),
  Later: mono('L', '#FF5C5C'),
  Buffer: icon(si.siBuffer),
  Hootsuite: icon(si.siHootsuite),
  'Sprout Social': mono('S', '#59CB59'),
  Metricool: mono('M', '#3B5BDB'),
  Planable: mono('P', '#0B57D0'),
  Preview: mono('P', '#231815'),
  Canva: icon(si.siCanva),
  CapCut: mono('CC', '#000000'),
  'Adobe Photoshop': mono('Ps', '#001E36', '#31A8FF'),
  'Adobe Lightroom Classic': mono('Lr', '#001E36', '#31A8FF'),
  'Adobe Illustrator': mono('Ai', '#330000', '#FF9A00'),
  'Adobe InDesign': mono('Id', '#49021F', '#FF3366'),
  'Adobe Acrobat': mono('Ac', '#B30B00'),
  Evoto: mono('E', '#111111'),
  ChatGPT: icon(si.siOpenai),
  Claude: icon(si.siClaude),
  Gemini: icon(si.siGooglegemini),
  'Kling AI': mono('K', '#111111'),
  Higgsfield: mono('H', '#111111'),
  n8n: icon(si.siN8n),
  GitHub: icon(si.siGithub),
  Shopify: icon(si.siShopify),
  'Amazon Seller Central': mono('a', '#232F3E', '#FF9900'),
  'TikTok Shop': icon(si.siTiktok),
  Magento: mono('M', '#EE672F'),
  'Cin7 Core': mono('C7', '#0F2A4A'),
  HighLevel: mono('HL', '#155EEF'),
  Klaviyo: mono('K', '#232426'),
  Mailchimp: icon(si.siMailchimp, '#241C15'),
  Notion: icon(si.siNotion),
  'monday.com': mono('m', '#FF3D57'),
  ClickUp: icon(si.siClickup),
  Trello: icon(si.siTrello),
  Airtable: icon(si.siAirtable),
  Slack: icon(si.siSlack),
  Word: mono('W', '#185ABD'),
  Excel: mono('X', '#107C41'),
  PowerPoint: mono('P', '#C43E1C'),
  Outlook: mono('O', '#0078D4'),
  Teams: mono('T', '#5059C9'),
  Drive: icon(si.siGoogledrive),
  Docs: icon(si.siGoogledocs),
  Sheets: icon(si.siGooglesheets),
  Slides: icon(si.siGoogleslides),
  Forms: icon(si.siGoogleforms),
  Calendar: icon(si.siGooglecalendar),
  Meet: icon(si.siGooglemeet),
  'Apps Script': icon(si.siGoogleappsscript),
};

export const toolIcon = (name: string): ToolIcon => map[name] ?? mono(name.charAt(0).toUpperCase(), '#4a2e27');
