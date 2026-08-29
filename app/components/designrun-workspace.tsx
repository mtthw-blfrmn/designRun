'use client';

import * as React from 'react';
import Image from 'next/image';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  Archive02Icon,
  ArrowRight01Icon,
  ArrowUpRight02Icon,
  BotIcon,
  CircleIcon,
  File02Icon,
  FolderManagementIcon,
  Image02Icon,
  Moon02Icon,
  RefreshIcon,
  Sun03Icon,
  TaskDone01Icon,
  Tick02Icon,
} from './icons';

type AppIconProps = { size?: number; className?: string };

function iconComponent(icon: IconSvgElement) {
  return function AppIcon({ size = 24, className }: AppIconProps) {
    return <HugeiconsIcon className={className} color="currentColor" fill="none" icon={icon} size={size} strokeWidth={1.65} />;
  };
}

const Archive = iconComponent(Archive02Icon);
const ArrowUpRight = iconComponent(ArrowUpRight02Icon);
const Bot = iconComponent(BotIcon);
const Check = iconComponent(Tick02Icon);
const ChevronRight = iconComponent(ArrowRight01Icon);
const Circle = iconComponent(CircleIcon);
const FileText = iconComponent(File02Icon);
const FolderKanban = iconComponent(FolderManagementIcon);
const Images = iconComponent(Image02Icon);
const ListChecks = iconComponent(TaskDone01Icon);
const Moon = iconComponent(Moon02Icon);
const Refresh = iconComponent(RefreshIcon);
const Sun = iconComponent(Sun03Icon);

type AttributeValue = string | string[] | boolean | null;

type DocumentRecord = {
  id: string;
  path: string;
  kind: string;
  title: string;
  attributes: Record<string, AttributeValue>;
  markdown: string;
  mtimeMs: number;
  updatedAt: string;
  searchText: string;
};

type TodoItem = {
  id: string;
  title: string;
  description: string;
  project: string;
  type: 'explicit' | 'inferred';
  owner: string;
  dueDate: string;
  size: number;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type SectionEntry = {
  id: string;
  title: string;
  body: string;
  searchText: string;
  category?: string;
  order?: number | null;
  officialUrl?: string;
  sourceOwner?: string;
  sourceUrl?: string;
  document?: DocumentRecord;
  media?: { path: string; extension: string; url: string; type: 'image' | 'video'; poster?: string } | null;
};
type AssetRecord = {
  id: string;
  path: string;
  title: string;
  extension: string;
  area: string;
  size: number;
  updatedAt: string;
  url: string;
  searchText: string;
};
type Skill = DocumentRecord & { slug: string; name: string; description: string };
type Deliverable = { slug: string; projectSlug: string; title: string; documents: DocumentRecord[] };
type Project = DocumentRecord & {
  slug: string;
  name: string;
  status: string;
  created: string | null;
  documents: DocumentRecord[];
  deliverables: Deliverable[];
};

type WorkspaceIndex = {
  schemaVersion: number;
  generatedAt: string;
  workspace: { name: string; tagline: string };
  stats: {
    projects: number;
    openTodos: number;
    references: number;
    assets: number;
    patterns: number;
    skills: number;
  };
  todos: { source: DocumentRecord; version: number; items: TodoItem[] };
  projects: Project[];
  inspiration: { source: DocumentRecord; documents: DocumentRecord[]; entries: SectionEntry[] };
  taste: DocumentRecord;
  designSystem: DocumentRecord;
  resources: DocumentRecord[];
  tools: { source: DocumentRecord; entries: SectionEntry[] };
  assets: AssetRecord[];
  skills: Skill[];
  patterns: DocumentRecord[];
  guide: DocumentRecord[];
  diagnostics: string[];
};

type View = 'todos' | 'projects' | 'inspiration' | 'taste' | 'system' | 'assets' | 'tools' | 'skills' | 'guide';
type Theme = 'light' | 'dark';

const navigation: Array<{ id: View; label: string }> = [
  { id: 'todos', label: 'To‑Do' },
  { id: 'projects', label: 'Projects' },
  { id: 'inspiration', label: 'Inspiration' },
  { id: 'taste', label: 'Taste' },
  { id: 'system', label: 'Design System' },
  { id: 'assets', label: 'Assets' },
  { id: 'tools', label: 'Tools' },
  { id: 'skills', label: 'Skills' },
];

function viewTitle(view: View) {
  if (view === 'guide') return 'Guide';
  return navigation.find((item) => item.id === view)?.label ?? 'designRun';
}

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<[^>]+>/g, '');
}

function plainText(markdown: string, maximum = 190) {
  const value = stripFrontmatter(markdown)
    .replace(/^(?:\s*#{1,6}\s+[^\n]+\n+)+/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return value.length > maximum ? `${value.slice(0, maximum).trim()}…` : value;
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatDate(value?: string | null) {
  if (!value) return 'Not recorded';
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function extractSections(markdown: string) {
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  return headings.map((heading, index) => {
    const bodyStart = (heading.index ?? 0) + heading[0].length;
    const bodyEnd = headings[index + 1]?.index ?? markdown.length;
    return { title: heading[1], body: markdown.slice(bodyStart, bodyEnd).trim() };
  });
}

function inlineMarkup(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && /^https?:\/\//.test(link[2])) return <a href={link[2]} key={index} rel="noreferrer" target="_blank">{link[1]}</a>;
    if (link) return <code key={index}>{link[1]}</code>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function resolveMarkdownAsset(target: string, sourcePath: string) {
  if (/^https?:\/\//.test(target)) return target;
  const cleanTarget = target.replace(/^\/+/, '');
  const rootOwned = /^(resources|projects)\//.test(cleanTarget);
  const base = sourcePath.includes('/') ? sourcePath.slice(0, sourcePath.lastIndexOf('/') + 1) : '';
  const segments = (rootOwned ? cleanTarget : `${base}${cleanTarget}`).split('/');
  const normalized: string[] = [];
  for (const segment of segments) {
    if (!segment || segment === '.') continue;
    if (segment === '..') normalized.pop();
    else normalized.push(segment);
  }
  return `/api/workspace-asset?path=${encodeURIComponent(normalized.join('/'))}`;
}

function Markdown({ markdown, sourcePath }: { markdown: string; sourcePath: string }) {
  const lines = stripFrontmatter(markdown).replace(/^\s*#\s+[^\n]+\n+/, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) { code.push(lines[index]); index += 1; }
      index += 1;
      blocks.push(<pre data-language={language || undefined} key={`code-${index}`}><code>{code.join('\n')}</code></pre>);
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const source = resolveMarkdownAsset(image[2], sourcePath);
      blocks.push(<Image alt={image[1]} className="markdown-image" height={800} key={`image-${index}`} src={source} unoptimized width={1200} />);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 5);
      const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;
      blocks.push(<Heading key={`heading-${index}`}>{inlineMarkup(heading[2])}</Heading>);
      index += 1;
      continue;
    }

    if (/^\|.+\|$/.test(line) && /^\|?[\s|:-]+\|?$/.test(lines[index + 1] ?? '')) {
      const header = line.split('|').slice(1, -1).map((cell) => cell.trim());
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && /^\|.+\|$/.test(lines[index])) {
        rows.push(lines[index].split('|').slice(1, -1).map((cell) => cell.trim()));
        index += 1;
      }
      blocks.push(<div className="markdown-table-wrap" key={`table-${index}`}><table><thead><tr>{header.map((cell, cellIndex) => <th key={cellIndex}>{inlineMarkup(cell)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineMarkup(cell)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) { items.push(lines[index].replace(/^[-*]\s+/, '')); index += 1; }
      blocks.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkup(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) { items.push(lines[index].replace(/^\d+\.\s+/, '')); index += 1; }
      blocks.push(<ol key={`ordered-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkup(item)}</li>)}</ol>);
      continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) { quote.push(lines[index].slice(2)); index += 1; }
      blocks.push(<blockquote key={`quote-${index}`}>{inlineMarkup(quote.join(' '))}</blockquote>);
      continue;
    }

    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={`rule-${index}`} />); index += 1; continue; }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,4})\s+/.test(lines[index]) && !/^[-*]\s+/.test(lines[index]) && !/^\d+\.\s+/.test(lines[index]) && !lines[index].startsWith('```') && !/^\|.+\|$/.test(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{inlineMarkup(paragraph.join(' '))}</p>);
  }

  return <div className="markdown">{blocks}</div>;
}

function UtilityButton({ label, onClick, busy = false, disabled = false, buttonRef }: {
  label: string;
  onClick: () => void;
  busy?: boolean;
  disabled?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return <button aria-busy={busy || undefined} className="utility-button" disabled={disabled} onClick={onClick} ref={buttonRef} title={label} type="button">{label}</button>;
}

function IconUtilityButton({ icon: Icon, label, onClick, busy = false, disabled = false }: {
  icon: React.ComponentType<AppIconProps>;
  label: string;
  onClick: () => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  return <button aria-busy={busy || undefined} aria-label={label} className="utility-button icon-only" disabled={disabled} onClick={onClick} title={label} type="button"><Icon size={17} /></button>;
}

type RefreshControl = { busy: boolean; onRefresh: () => void };
const RefreshControlContext = React.createContext<RefreshControl | null>(null);

function EmptyState({ icon: Icon, title, description, action }: { icon: React.ComponentType<{ size?: number }>; title: string; description: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span><Icon size={22} /></span><h2>{title}</h2><p>{description}</p>{action}</div>;
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  const refreshControl = React.useContext(RefreshControlContext);
  return <header className="section-header"><div><h1>{title}</h1><span>{description}</span></div>{(refreshControl || action) && <div className="header-actions">{refreshControl && <IconUtilityButton busy={refreshControl.busy} disabled={refreshControl.busy} icon={Refresh} label={refreshControl.busy ? 'Refreshing…' : 'Refresh'} onClick={refreshControl.onRefresh} />}{action}</div>}</header>;
}

function WelcomeCard({ onDismiss, onExploreSample, onStartProject, theme }: {
  onDismiss: () => void;
  onExploreSample: () => void;
  onStartProject: () => void;
  theme: Theme;
}) {
  return <aside aria-labelledby="welcome-title" className="welcome-card">
    <div className="welcome-copy">
      <Image alt="designRun" className="welcome-logo" height={32} src={theme === 'light' ? '/designRun_onLight.svg' : '/designRun_onDark.svg'} width={32} />
      <h2 id="welcome-title">Work in your favorite harness</h2>
      <span>Load designRun root folder in Cursor, Claude Code, Codex, etc. designRun UI is simply the traceable surface for you and your agents’ design work.</span>
      <div className="welcome-actions"><button className="button primary" onClick={onStartProject} type="button">Start my project</button><button className="button secondary" onClick={onExploreSample} type="button">Explore the sample</button></div>
    </div>
    <UtilityButton label="Dismiss" onClick={onDismiss} />
  </aside>;
}

function AgentCommand({ open, context, initialTask, onClose, onCopy }: {
  open: boolean;
  context: string;
  initialTask: string;
  onClose: () => void;
  onCopy: (task: string) => void;
}) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const focusFrameRef = React.useRef<number | null>(null);
  const [task, setTask] = React.useState(initialTask);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (focusFrameRef.current !== null) window.cancelAnimationFrame(focusFrameRef.current);
    if (open) {
      dialog.classList.remove('is-closing');
      if (!dialog.open) {
        setTask(initialTask);
        dialog.showModal();
      }
      focusFrameRef.current = window.requestAnimationFrame(() => textareaRef.current?.focus());
    } else if (dialog.open) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        dialog.close();
      } else {
        dialog.classList.add('is-closing');
        closeTimerRef.current = window.setTimeout(() => {
          dialog.close();
          dialog.classList.remove('is-closing');
          closeTimerRef.current = null;
        }, 160);
      }
    }
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (focusFrameRef.current !== null) window.cancelAnimationFrame(focusFrameRef.current);
    };
  }, [initialTask, open]);

  return <dialog aria-labelledby="agent-dialog-title" className="agent-dialog" onCancel={(event) => { event.preventDefault(); onClose(); }} ref={dialogRef}>
    <form onSubmit={(event) => { event.preventDefault(); onCopy(task); }}>
      <header><span className="agent-dialog-icon"><Bot size={18} /></span><div><p>Agent command</p><h2 id="agent-dialog-title">Continue in your harness</h2></div><UtilityButton label="Close" onClick={onClose} /></header>
      <div className="agent-context"><span>Context</span><code>{context}</code></div>
      <label htmlFor="agent-task">What should the agent do?</label>
      <textarea id="agent-task" onChange={(event) => setTask(event.target.value)} placeholder="Describe the outcome, constraint, or question in your own words…" ref={textareaRef} rows={6} value={task} />
      <p className="agent-dialog-note">designRun adds the source paths and operating rules. Paste the copied prompt into the agent harness that has this project open.</p>
      <footer><button className="button secondary" onClick={onClose} type="button">Cancel</button><button className="button primary" disabled={!task.trim()} type="submit">Copy agent command</button></footer>
    </form>
  </dialog>;
}

function DocumentEditor({ document, onBack, onSaved, onCopyPrompt }: {
  document: DocumentRecord;
  onBack: () => void;
  onSaved: (document: DocumentRecord) => void;
  onCopyPrompt: (document: DocumentRecord) => void;
}) {
  const storageKey = `designrun:draft:${document.path}`;
  const [mode, setMode] = React.useState<'read' | 'edit'>('read');
  const [draft, setDraft] = React.useState(document.markdown);
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'saved' | 'conflict' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const localDraft = window.localStorage.getItem(storageKey);
      setDraft(localDraft ?? document.markdown);
      setMode(localDraft && localDraft !== document.markdown ? 'edit' : 'read');
      setStatus('idle');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [document.path, document.markdown, storageKey]);

  React.useEffect(() => {
    if (draft !== document.markdown) window.localStorage.setItem(storageKey, draft);
    else window.localStorage.removeItem(storageKey);
  }, [document.markdown, draft, storageKey]);

  async function save() {
    setStatus('saving');
    setMessage('');
    const response = await fetch(`/api/workspace-file?path=${encodeURIComponent(document.path)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown: draft, previousMtimeMs: document.mtimeMs }),
    });
    const payload = await response.json() as { error?: string; markdown?: string; mtimeMs?: number; updatedAt?: string };
    if (response.status === 409) {
      setStatus('conflict');
      setMessage('The source changed on disk. Your draft is preserved locally; refresh the workspace before reconciling it.');
      return;
    }
    if (!response.ok || typeof payload.markdown !== 'string' || typeof payload.mtimeMs !== 'number') {
      setStatus('error');
      setMessage(payload.error ?? 'The source could not be saved.');
      return;
    }
    const saved = { ...document, markdown: payload.markdown, mtimeMs: payload.mtimeMs, updatedAt: payload.updatedAt ?? new Date().toISOString(), searchText: `${document.title} ${document.path} ${payload.markdown}`.toLowerCase() };
    window.localStorage.removeItem(storageKey);
    setStatus('saved');
    setMode('read');
    onSaved(saved);
  }

  const dirty = draft !== document.markdown;
  const sourceUrl = typeof document.attributes.source_url === 'string' ? document.attributes.source_url : '';
  const sourceOwner = typeof document.attributes.source_owner === 'string' ? document.attributes.source_owner : '';
  const category = typeof document.attributes.category === 'string' ? document.attributes.category : '';
  const capturedDate = typeof document.attributes.date_captured === 'string' ? document.attributes.date_captured : '';
  const license = typeof document.attributes.license === 'string' ? document.attributes.license : '';
  const redistribution = typeof document.attributes.redistribution === 'string' ? document.attributes.redistribution : '';
  const mediaPath = typeof document.attributes.media === 'string' && document.attributes.media !== 'none' ? document.attributes.media : '';
  const mediaUrl = mediaPath ? resolveMarkdownAsset(mediaPath, document.path) : '';
  const mediaExtension = mediaPath.split('.').pop()?.toLowerCase() ?? '';
  const posterPath = typeof document.attributes.poster === 'string' ? document.attributes.poster : '';
  const posterUrl = posterPath ? resolveMarkdownAsset(posterPath, document.path) : undefined;
  return <div className="document-workspace">
    <div className="document-toolbar">
      <button className="back-button" onClick={onBack} type="button">Back</button>
      <div className="document-toolbar-actions">
        <button className="button secondary" onClick={() => onCopyPrompt(document)} type="button">Copy agent handoff</button>
        <fieldset className="segmented-control"><legend className="sr-only">Document mode</legend>
          <button aria-pressed={mode === 'read'} className={mode === 'read' ? 'is-active' : ''} onClick={() => setMode('read')} type="button">Read</button>
          <button aria-pressed={mode === 'edit'} className={mode === 'edit' ? 'is-active' : ''} onClick={() => setMode('edit')} type="button">Edit</button>
        </fieldset>
        {mode === 'edit' && <button className="button primary" disabled={!dirty || status === 'saving'} onClick={save} type="button">{status === 'saving' ? 'Saving…' : 'Save source'}</button>}
      </div>
    </div>
    <header className="document-heading"><p>{document.path}</p><h1>{document.title}</h1><span>Updated {formatDate(document.updatedAt)} · source-backed Markdown</span>
      {sourceUrl && <div className="document-provenance"><div>{category && <span>{category}</span>}{sourceOwner && <span>{sourceOwner}</span>}{capturedDate && <span>Inspected {formatDate(capturedDate)}</span>}{license && <span>{license}</span>}{redistribution && <span className={redistribution === 'review-required' ? 'needs-review' : ''}>{redistribution}</span>}</div><a className="button secondary" href={sourceUrl} rel="noreferrer" target="_blank">Open canonical source<ArrowUpRight size={14} /></a></div>}
    </header>
    {message && <div className={`document-notice ${status}`}>{message}</div>}
    {mode === 'read' && mediaUrl && <figure className="document-media">{['mp4', 'mov', 'webm'].includes(mediaExtension) ? <video controls playsInline poster={posterUrl} preload="metadata" src={mediaUrl}><track default kind="captions" label="No captions provided" src="data:text/vtt,WEBVTT" srcLang="en" /></video> : <Image alt={`${document.title} reference`} height={1000} src={mediaUrl} unoptimized width={1600} />}<figcaption><span>Reference evidence</span><code>{mediaPath}</code></figcaption></figure>}
    {mode === 'read' ? <article className="document-paper"><Markdown markdown={draft} sourcePath={document.path} /></article> : <div className="editor-split"><textarea aria-label={`Edit ${document.title}`} onChange={(event) => setDraft(event.target.value)} spellCheck="true" value={draft} /><article className="document-preview"><Markdown markdown={draft} sourcePath={document.path} /></article></div>}
  </div>;
}

function replaceDocument(index: WorkspaceIndex, updated: DocumentRecord): WorkspaceIndex {
  const replace = <T extends DocumentRecord>(record: T) => record.path === updated.path ? { ...record, ...updated } : record;
  return {
    ...index,
    taste: replace(index.taste),
    designSystem: replace(index.designSystem),
    todos: { ...index.todos, source: replace(index.todos.source) },
    inspiration: {
      ...index.inspiration,
      source: replace(index.inspiration.source),
      documents: index.inspiration.documents.map(replace),
      entries: index.inspiration.entries.map((entry) => entry.document?.path === updated.path ? { ...entry, document: replace(entry.document) } : entry),
    },
    tools: { ...index.tools, source: replace(index.tools.source) },
    resources: index.resources.map(replace),
    skills: index.skills.map(replace),
    patterns: index.patterns.map(replace),
    guide: index.guide.map(replace),
    projects: index.projects.map((project) => ({
      ...(replace(project) as Project),
      documents: project.documents.map(replace),
      deliverables: project.deliverables.map((deliverable) => ({ ...deliverable, documents: deliverable.documents.map(replace) })),
    })),
  };
}

function findDocument(index: WorkspaceIndex, documentPath: string) {
  const globalDocuments = [
    index.taste,
    index.designSystem,
    index.todos.source,
    index.inspiration.source,
    ...index.inspiration.documents,
    index.tools.source,
    ...index.resources,
    ...index.skills,
    ...index.patterns,
    ...index.guide,
  ];
  const projectDocuments = index.projects.flatMap((project) => [project, ...project.documents]);
  return [...globalDocuments, ...projectDocuments].find((document) => document.path === documentPath) ?? null;
}

function TodosView({ index, query, onSource, onIndexChange, notify, onDismissWelcome, onExploreSample, onStartProject, showWelcome, theme }: {
  index: WorkspaceIndex;
  query: string;
  onSource: (document: DocumentRecord) => void;
  onIndexChange: (index: WorkspaceIndex) => void;
  notify: (message: string) => void;
  onDismissWelcome: () => void;
  onExploreSample: () => void;
  onStartProject: () => void;
  showWelcome: boolean;
  theme: Theme;
}) {
  const [items, setItems] = React.useState(index.todos.items);
  const [filter, setFilter] = React.useState<'open' | 'all' | 'done'>('open');
  const [adding, setAdding] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [project, setProject] = React.useState('');
  const [urgency, setUrgency] = React.useState<TodoItem['urgency']>('medium');

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setItems(index.todos.items));
    return () => window.cancelAnimationFrame(frame);
  }, [index.todos.items]);

  async function persist(nextItems: TodoItem[]) {
    const json = JSON.stringify({ version: index.todos.version, todos: nextItems }, null, 2);
    const markdown = index.todos.source.markdown.replace(/```json\s*[\s\S]*?```/i, `\`\`\`json\n${json}\n\`\`\``);
    const response = await fetch(`/api/workspace-file?path=${encodeURIComponent(index.todos.source.path)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown, previousMtimeMs: index.todos.source.mtimeMs }),
    });
    const payload = await response.json() as { error?: string; markdown?: string; mtimeMs?: number; updatedAt?: string };
    if (!response.ok || typeof payload.markdown !== 'string' || typeof payload.mtimeMs !== 'number') throw new Error(payload.error ?? 'Could not save To‑Dos.');
    const source = { ...index.todos.source, markdown: payload.markdown, mtimeMs: payload.mtimeMs, updatedAt: payload.updatedAt ?? new Date().toISOString() };
    onIndexChange({
      ...index,
      stats: { ...index.stats, openTodos: nextItems.filter((item) => !item.completed).length },
      todos: { ...index.todos, source, items: nextItems },
    });
    notify('To‑Dos saved to knowledge/todos.md');
  }

  async function toggle(item: TodoItem) {
    const nextItems = items.map((candidate) => candidate.id === item.id ? { ...candidate, completed: !candidate.completed, updatedAt: new Date().toISOString() } : candidate);
    setItems(nextItems);
    try { await persist(nextItems); } catch (error) { setItems(items); notify(error instanceof Error ? error.message : 'Could not save To‑Dos.'); }
  }

  async function addTask(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    const timestamp = new Date().toISOString();
    const task: TodoItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: '',
      project: project.trim() || 'Unassigned',
      type: 'explicit',
      owner: 'me',
      dueDate: '',
      size: 1,
      urgency,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const nextItems = [task, ...items];
    setItems(nextItems);
    setTitle('');
    setProject('');
    setAdding(false);
    try { await persist(nextItems); } catch (error) { setItems(items); notify(error instanceof Error ? error.message : 'Could not add task.'); }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    const statusMatches = filter === 'all' || (filter === 'open' && !item.completed) || (filter === 'done' && item.completed);
    const queryMatches = !normalizedQuery || `${item.title} ${item.description} ${item.project} ${item.owner}`.toLowerCase().includes(normalizedQuery);
    return statusMatches && queryMatches;
  });
  return <div className="view-stack">
    <SectionHeader title="To‑Do" description="Keep the next actions for you and your agent in one shared queue." action={<><button className="button secondary" onClick={() => onSource(index.todos.source)} type="button">Open source</button><button className="button primary" onClick={() => setAdding((value) => !value)} type="button">{adding ? 'Close' : 'Add task'}</button></>} />
    {showWelcome && <WelcomeCard onDismiss={onDismissWelcome} onExploreSample={onExploreSample} onStartProject={onStartProject} theme={theme} />}
    {adding && <form className="task-composer" onSubmit={addTask}><input aria-label="Task title" onChange={(event) => setTitle(event.target.value)} placeholder="What needs to happen?" value={title} /><input aria-label="Task project" onChange={(event) => setProject(event.target.value)} placeholder="Project" value={project} /><select aria-label="Task urgency" onChange={(event) => setUrgency(event.target.value as TodoItem['urgency'])} value={urgency}><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select><button className="button primary" type="submit">Add</button></form>}
    <div className="view-controls"><div className="segmented-control"><button aria-pressed={filter === 'open'} className={filter === 'open' ? 'is-active' : ''} onClick={() => setFilter('open')} type="button">Open <span>{items.filter((item) => !item.completed).length}</span></button><button aria-pressed={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')} type="button">All <span>{items.length}</span></button><button aria-pressed={filter === 'done'} className={filter === 'done' ? 'is-active' : ''} onClick={() => setFilter('done')} type="button">Done <span>{items.filter((item) => item.completed).length}</span></button></div><span className="source-status"><Circle size={7} />Saved in {index.todos.source.path}</span></div>
    {visible.length ? <div className="todo-list">{visible.map((item) => <div className={`todo-row${item.completed ? ' is-complete' : ''}`} key={item.id}><button aria-label={item.completed ? `Reopen ${item.title}` : `Complete ${item.title}`} aria-pressed={item.completed} className="todo-check" onClick={() => toggle(item)} type="button" /><div className="todo-copy"><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}<div><span>{item.project}</span><span>{item.type}</span><span>{item.owner || 'unassigned'}</span>{item.dueDate && <span>Due {formatDate(item.dueDate)}</span>}</div></div><span className={`urgency ${item.urgency}`}>{item.urgency}</span></div>)}</div> : <EmptyState icon={ListChecks} title="No matching tasks" description="Change the filter or add the next concrete action." />}
  </div>;
}

function ProjectsView({ projects, query, activeProject, activeDeliverable, onProject, onDeliverable, onDocument, onCopyProject }: {
  projects: Project[];
  query: string;
  activeProject: Project | null;
  activeDeliverable: Deliverable | null;
  onProject: (project: Project | null) => void;
  onDeliverable: (deliverable: Deliverable | null) => void;
  onDocument: (document: DocumentRecord) => void;
  onCopyProject: (project?: Project) => void;
}) {
  if (activeProject && activeDeliverable) {
    return <div className="view-stack"><button className="back-button" onClick={() => onDeliverable(null)} type="button">{activeProject.name}</button><SectionHeader title={activeDeliverable.title} description={`${countLabel(activeDeliverable.documents.length, 'source document')} in projects/${activeProject.slug}/deliverables/${activeDeliverable.slug}/`} action={<button className="button secondary" onClick={() => onCopyProject(activeProject)} type="button">Copy agent handoff</button>} /><DocumentRows documents={activeDeliverable.documents} onDocument={onDocument} /></div>;
  }

  if (activeProject) {
    const deliverablePaths = new Set(activeProject.deliverables.flatMap((deliverable) => deliverable.documents.map((document) => document.path)));
    const standalone = activeProject.documents.filter((document) => !deliverablePaths.has(document.path));
    const strategy = standalone.filter((document) => /\/(brief|research|decisions|theme|tokens|figma|strategy)[^/]*\.md$/i.test(document.path) || document.path.includes('/strategy/'));
    const overview = standalone.filter((document) => document.path.endsWith('/README.md'));
    const operating = standalone.filter((document) => !strategy.includes(document) && !overview.includes(document));
    return <div className="view-stack"><button className="back-button" onClick={() => onProject(null)} type="button">All projects</button><SectionHeader title={activeProject.name} description={`${countLabel(activeProject.documents.length, 'source document')} · created ${formatDate(activeProject.created)}`} action={<button className="button secondary" onClick={() => onCopyProject(activeProject)} type="button">Copy agent handoff</button>} />
      {activeProject.deliverables.length > 0 && <section><div className="subsection-heading"><div><p>Active work</p><h2>Deliverables</h2></div></div><div className="deliverable-grid">{activeProject.deliverables.map((deliverable) => <button className="deliverable-card" key={deliverable.slug} onClick={() => onDeliverable(deliverable)} type="button"><strong>{deliverable.title}</strong><p>{countLabel(deliverable.documents.length, 'source document')}</p><small>projects/{activeProject.slug}/deliverables/{deliverable.slug}</small></button>)}</div></section>}
      {strategy.length > 0 && <section><div className="subsection-heading"><div><p>Product direction</p><h2>Strategy</h2></div></div><DocumentRows documents={strategy} onDocument={onDocument} /></section>}
      {operating.length > 0 && <section><div className="subsection-heading"><div><p>Project memory</p><h2>Operating documents</h2></div></div><DocumentRows documents={operating} onDocument={onDocument} /></section>}
      {overview.length > 0 && <section><div className="subsection-heading"><div><p>Project front door</p><h2>Overview</h2></div></div><DocumentRows documents={overview} onDocument={onDocument} /></section>}
    </div>;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visible = projects.filter((project) => !normalizedQuery || project.searchText.includes(normalizedQuery) || project.documents.some((document) => document.searchText.includes(normalizedQuery)));
  return <div className="view-stack"><SectionHeader title="Projects" description="Keep each product's context and files ready for your agent." action={<button className="button primary" onClick={() => onCopyProject()} type="button">New project</button>} />
    {visible.length ? <div className="project-grid">{visible.map((project) => <button className="project-card" key={project.slug} onClick={() => onProject(project)} type="button"><div><span className="project-status"><i />{project.status}</span></div><h2>{project.name}</h2><p>{plainText(project.markdown, 130)}</p><footer><span>{countLabel(project.deliverables.length, 'deliverable')}</span><span>{countLabel(project.documents.length, 'doc')}</span></footer></button>)}</div> : <EmptyState icon={FolderKanban} title="No projects yet" description="Create a product workspace from the project template, then shape its brief with your agent." action={<button className="button primary" onClick={() => onCopyProject()} type="button">Copy setup prompt</button>} />}
  </div>;
}

function DocumentRows({ documents, onDocument }: { documents: DocumentRecord[]; onDocument: (document: DocumentRecord) => void }) {
  return <div className="document-rows">{documents.map((document) => <button key={document.path} onClick={() => onDocument(document)} type="button"><div><strong>{document.title}</strong><small>{document.path}</small></div><time>{formatDate(document.updatedAt)}</time><ChevronRight aria-hidden className="row-chevron" size={16} /></button>)}</div>;
}

function InspirationView({ index, query, onSource }: { index: WorkspaceIndex; query: string; onSource: (document: DocumentRecord) => void }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visible = index.inspiration.entries.filter((entry) => !normalizedQuery || entry.searchText.includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Inspiration" description="Ground your agent in references that should shape the work." action={<button className="button secondary" onClick={() => onSource(index.inspiration.source)} type="button">Library guide</button>} />
    {visible.length ? <div className="reference-grid">{visible.map((entry, indexValue) => <button className="reference-card" key={entry.id} onClick={() => onSource(entry.document ?? index.inspiration.source)} type="button"><div className={`reference-visual${entry.media ? ' has-media' : ''}`}><span>{String(indexValue + 1).padStart(2, '0')}</span>{entry.media?.type === 'image' ? <Image alt={`${entry.title} reference`} fill sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw" src={entry.media.url} unoptimized /> : entry.media?.type === 'video' ? <video aria-label={`${entry.title} reference video`} muted playsInline poster={entry.media.poster} preload="metadata" src={entry.media.url} /> : null}</div><div className="reference-copy"><p>{entry.category || 'Reference'}{entry.sourceOwner ? ` · ${entry.sourceOwner}` : ''}</p><h2>{entry.title}</h2><span>{plainText(entry.body, 175)}</span>{entry.media && <code>{entry.media.path}</code>}</div></button>)}</div> : <EmptyState icon={Images} title="No references match" description="Capture a source, what works, the principle to inherit, and what should not be copied literally." />}
  </div>;
}

function TasteView({ document, query, onSource }: { document: DocumentRecord; query: string; onSource: (document: DocumentRecord) => void }) {
  const normalizedQuery = query.trim().toLowerCase();
  const sections = extractSections(document.markdown).filter((section) => !normalizedQuery || `${section.title} ${section.body}`.toLowerCase().includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Taste" description="Teach your agent the judgment you want reflected in the work." action={<button className="button secondary" onClick={() => onSource(document)} type="button">Edit Taste source</button>} />
    <div className="taste-list">{sections.map((section, index) => <button key={section.title} onClick={() => onSource(document)} type="button"><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2><p>{plainText(section.body, 240)}</p></div><ChevronRight aria-hidden className="row-chevron" size={16} /></button>)}</div>
  </div>;
}

function SystemView({ index, query, onDocument }: { index: WorkspaceIndex; query: string; onDocument: (document: DocumentRecord) => void }) {
  const sourcePaths = new Set(['resources/design-system.md', 'resources/accessibility.md', 'resources/motion.md', 'resources/content.md', 'resources/research-principles.md']);
  const documents = index.resources.filter((document) => sourcePaths.has(document.path));
  const normalizedQuery = query.trim().toLowerCase();
  const visible = documents.filter((document) => !normalizedQuery || document.searchText.includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Design System" description="Keep your agent building from the same product standards." action={<button className="button secondary" onClick={() => onDocument(index.designSystem)} type="button">Open system source</button>} />
    <div className="library-grid">{visible.map((document) => <button className="library-card" key={document.path} onClick={() => onDocument(document)} type="button"><p>{document.kind}</p><h2>{document.title}</h2><span>{plainText(document.markdown, 155)}</span><footer><code>{document.path}</code></footer></button>)}</div>
  </div>;
}

function AssetsView({ assets, query }: { assets: AssetRecord[]; query: string }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visible = assets.filter((asset) => !normalizedQuery || asset.searchText.includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Assets" description="Give your agent approved visuals to reuse in the work." />
    {visible.length ? <div className="asset-grid">{visible.map((asset) => <article className="asset-card" key={asset.id}><a className="asset-open" href={asset.url} rel="noreferrer" target="_blank"><div className="asset-preview">{['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(asset.extension) ? <Image alt={asset.title} fill sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw" src={asset.url} unoptimized /> : ['mp4', 'mov', 'webm'].includes(asset.extension) ? <video muted playsInline preload="metadata" src={asset.url} /> : <FileText size={30} />}</div><div><p>{asset.area} · {asset.extension.toUpperCase()}</p><h2>{asset.title}</h2><span>{formatBytes(asset.size)} · {formatDate(asset.updatedAt)}</span><code>{asset.path}</code><ArrowUpRight size={15} /></div></a></article>)}</div> : <EmptyState icon={Archive} title="The asset library is ready" description="Drop unreviewed files into resources/raw-assets/. After visual and licensing review, promote reusable material into resources/asset-library/." />}
  </div>;
}

function ToolsView({ index, query, onSource }: { index: WorkspaceIndex; query: string; onSource: (document: DocumentRecord) => void }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visible = index.tools.entries.filter((entry) => !normalizedQuery || entry.searchText.includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Tools" description="Help your agent choose the right tool for each task." action={<button className="button secondary" onClick={() => onSource(index.tools.source)} type="button">Edit tool source</button>} />
    <div className="tool-list">{visible.map((entry, indexValue) => <button aria-label={`Open ${entry.title}`} key={entry.id} onClick={() => onSource(entry.document ?? index.tools.source)} type="button"><div><p>{String(indexValue + 1).padStart(2, '0')}</p><h2>{entry.title}</h2><small>{plainText(entry.body, 210)}</small></div><ChevronRight aria-hidden className="row-chevron" size={16} /></button>)}</div>
  </div>;
}

function SkillsView({ skills, query, onDocument, onCopySkill }: { skills: Skill[]; query: string; onDocument: (document: DocumentRecord) => void; onCopySkill: (skill: Skill) => void }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visible = skills.filter((skill) => !normalizedQuery || skill.searchText.includes(normalizedQuery) || skill.description.toLowerCase().includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Skills" description="Run repeatable design workflows with your agent." />
    <div className="skill-grid">{visible.map((skill) => <article className="skill-card" key={skill.slug}><button className="skill-open" onClick={() => onDocument(skill)} type="button"><h2>{skill.name}</h2><span>{skill.description}</span><code>{skill.path}</code></button><button className="skill-copy" onClick={() => onCopySkill(skill)} type="button">Copy prompt</button></article>)}</div>
  </div>;
}

function GuideView({ documents, query, onDocument }: { documents: DocumentRecord[]; query: string; onDocument: (document: DocumentRecord) => void }) {
  const normalizedQuery = query.trim().toLowerCase();
  const visible = documents.filter((document) => !normalizedQuery || document.searchText.includes(normalizedQuery));
  return <div className="view-stack"><SectionHeader title="Guide" description="Learn how to use designRun in your agentic coding environment." /><DocumentRows documents={visible} onDocument={onDocument} /></div>;
}

export function DesignRunWorkspace() {
  const [index, setIndex] = React.useState<WorkspaceIndex | null>(null);
  const [error, setError] = React.useState('');
  const [view, setView] = React.useState<View>('todos');
  const query = '';
  const [activeDocument, setActiveDocument] = React.useState<DocumentRecord | null>(null);
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);
  const [activeDeliverable, setActiveDeliverable] = React.useState<Deliverable | null>(null);
  const [navOpen, setNavOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('light');
  const [toast, setToast] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [agentOpen, setAgentOpen] = React.useState(false);
  const [agentInitialTask, setAgentInitialTask] = React.useState('');
  const [welcomeVisible, setWelcomeVisible] = React.useState(false);
  const toastTimerRef = React.useRef<number | null>(null);
  const mobileNavOpenRef = React.useRef<HTMLButtonElement>(null);
  const mobileNavCloseRef = React.useRef<HTMLButtonElement>(null);

  const loadIndex = React.useCallback(async (background = false) => {
    try {
      const response = await fetch(`/workspace-index.json?time=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Run npm run index, then refresh.');
      const payload = await response.json() as WorkspaceIndex;
      setIndex((current) => current?.generatedAt === payload.generatedAt ? current : payload);
      setActiveDocument((current) => {
        if (!current) return current;
        const next = findDocument(payload, current.path);
        const hasDraft = window.localStorage.getItem(`designrun:draft:${current.path}`) != null;
        return next && !hasDraft ? next : current;
      });
      setActiveProject((current) => current ? payload.projects.find((project) => project.slug === current.slug) ?? null : current);
      setActiveDeliverable((current) => current
        ? payload.projects.find((project) => project.slug === current.projectSlug)?.deliverables.find((deliverable) => deliverable.slug === current.slug) ?? null
        : current);
      setError('');
      return true;
    } catch (loadError) {
      if (!background) setError(loadError instanceof Error ? loadError.message : 'Workspace index unavailable.');
      return false;
    }
  }, []);

  React.useEffect(() => {
    const initialTimer = window.setTimeout(() => void loadIndex(), 0);
    const syncTimer = window.setInterval(() => void loadIndex(true), 5000);
    const syncWhenVisible = () => { if (document.visibilityState === 'visible') void loadIndex(true); };
    window.addEventListener('focus', syncWhenVisible);
    document.addEventListener('visibilitychange', syncWhenVisible);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(syncTimer);
      window.removeEventListener('focus', syncWhenVisible);
      document.removeEventListener('visibilitychange', syncWhenVisible);
    };
  }, [loadIndex]);
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem('designrun:theme') as Theme | null;
      if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
      setWelcomeVisible(window.localStorage.getItem('designrun:welcome-dismissed:v1') !== 'true');
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  React.useEffect(() => { document.documentElement.dataset.theme = theme; window.localStorage.setItem('designrun:theme', theme); }, [theme]);
  React.useEffect(() => {
    const openAgentCommand = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setAgentInitialTask('');
        setAgentOpen(true);
      }
    };
    window.addEventListener('keydown', openAgentCommand);
    return () => window.removeEventListener('keydown', openAgentCommand);
  }, []);
  React.useEffect(() => {
    if (!navOpen) return;
    const openButton = mobileNavOpenRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => mobileNavCloseRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      openButton?.focus();
    };
  }, [navOpen]);
  React.useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  function notify(message: string) {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast('');
      toastTimerRef.current = null;
    }, 2600);
  }

  async function refreshIndex() {
    if (refreshing) return;
    setRefreshing(true);
    const refreshed = await loadIndex();
    setRefreshing(false);
    if (refreshed) notify('Source index refreshed');
  }

  async function copy(text: string, message: string) {
    await navigator.clipboard.writeText(text);
    notify(message);
  }

  function navigate(nextView: View) {
    setView(nextView);
    setActiveDocument(null);
    setActiveProject(null);
    setActiveDeliverable(null);
    setNavOpen(false);
  }

  function saveDocument(document: DocumentRecord) {
    setIndex((current) => current ? replaceDocument(current, document) : current);
    setActiveDocument(document);
    notify(`Saved ${document.path}`);
  }

  function copyDocumentHandoff(document: DocumentRecord) {
    void copy(`Work on the designRun source \`${document.path}\`. Read the root AGENTS.md and the active project's guidance if this source belongs to a project. Use this file as durable source material, inspect linked artifacts directly, make the requested changes in the owning source or implementation, verify the result, and preserve durable decisions. Task: [describe what you want changed]`, 'Agent handoff copied');
  }

  function copyProjectHandoff(project?: Project) {
    const prompt = project
      ? `Work in the designRun project \`${project.path.replace('/README.md', '')}/\`. Read the root AGENTS.md, then the project's AGENTS.md, brief.md, and decisions.md. Load only the sources that can change the result. Put work in the owning project document, deliverable, or named implementation repository and verify it. Task: [describe the outcome]`
      : 'Create a new designRun project called [product name]. Use the project-setup workflow, shape the brief from what I know, mark missing evidence instead of inventing it, and recommend the smallest next artifact that reduces the most important uncertainty.';
    void copy(prompt, project ? 'Project handoff copied' : 'Project setup prompt copied');
  }

  function openAgent(task = '') {
    setAgentInitialTask(task);
    setAgentOpen(true);
  }

  function dismissWelcome() {
    window.localStorage.setItem('designrun:welcome-dismissed:v1', 'true');
    setWelcomeVisible(false);
  }

  function exploreSample() {
    const sample = index?.projects.find((project) => project.slug === 'relay-sample') ?? null;
    setView('projects');
    setActiveDocument(null);
    setActiveProject(sample);
    setActiveDeliverable(null);
  }

  function currentAgentContext() {
    if (activeDocument) return activeDocument.path;
    if (activeProject && activeDeliverable) return `projects/${activeProject.slug}/deliverables/${activeDeliverable.slug}/`;
    if (activeProject) return `projects/${activeProject.slug}/`;
    return `${viewTitle(view)} · workspace-level`;
  }

  function copyAgentCommand(task: string) {
    const target = currentAgentContext();
    const sourceInstruction = activeDocument
      ? `Start with \`${activeDocument.path}\` and treat it as durable source material.`
      : activeProject
        ? `Start in \`projects/${activeProject.slug}/\` and read its AGENTS.md, brief.md, and decisions.md.`
        : `Use the ${viewTitle(view)} area and load only the workspace sources that can change the result.`;
    void copy(`Work in this designRun repository. Read the root AGENTS.md and follow the relevant repository skill. ${sourceInstruction} Put durable output in the owning project, source, or named implementation repository; inspect supplied artifacts directly; verify the result in the strongest available medium; and do not publish or mutate external systems without explicit authorization.\n\nTask: ${task.trim()}\n\nCurrent control-center context: ${target}`, 'Agent command copied');
    setAgentOpen(false);
  }

  if (error) return <main className="load-state"><Image alt="" height={42} src="/designRun_onLight.svg" width={42} /><h1>Workspace index unavailable</h1><p>{error}</p><button className="button primary" onClick={() => void loadIndex()} type="button">Try again</button></main>;
  if (!index) return <main className="load-state"><Image alt="" height={42} src="/designRun_onLight.svg" width={42} /><p>Loading designRun…</p></main>;

  let content: React.ReactNode;
  if (activeDocument) content = <DocumentEditor document={activeDocument} onBack={() => setActiveDocument(null)} onCopyPrompt={copyDocumentHandoff} onSaved={saveDocument} />;
  else if (view === 'todos') content = <TodosView index={index} notify={notify} onDismissWelcome={dismissWelcome} onExploreSample={exploreSample} onIndexChange={setIndex} onSource={setActiveDocument} onStartProject={() => openAgent('Help me start a new product design project. Shape the brief from what I know, ask only for information that would materially change the work, and create the project using the project-setup workflow.')} query={query} showWelcome={welcomeVisible} theme={theme} />;
  else if (view === 'projects') content = <ProjectsView activeDeliverable={activeDeliverable} activeProject={activeProject} onCopyProject={copyProjectHandoff} onDeliverable={setActiveDeliverable} onDocument={setActiveDocument} onProject={(project) => { setActiveProject(project); setActiveDeliverable(null); }} projects={index.projects} query={query} />;
  else if (view === 'inspiration') content = <InspirationView index={index} onSource={setActiveDocument} query={query} />;
  else if (view === 'taste') content = <TasteView document={index.taste} onSource={setActiveDocument} query={query} />;
  else if (view === 'system') content = <SystemView index={index} onDocument={setActiveDocument} query={query} />;
  else if (view === 'assets') content = <AssetsView assets={index.assets} query={query} />;
  else if (view === 'tools') content = <ToolsView index={index} onSource={setActiveDocument} query={query} />;
  else if (view === 'skills') content = <SkillsView onCopySkill={(skill) => void copy(`Use the \`${skill.name}\` skill for this task: [describe the outcome]. Read \`${skill.path}\` and follow it, then put durable output in the owning project or implementation repository.`, `${skill.name} prompt copied`)} onDocument={setActiveDocument} query={query} skills={index.skills} />;
  else content = <GuideView documents={index.guide} onDocument={setActiveDocument} query={query} />;

  const contentKey = activeDocument
    ? `document:${activeDocument.path}`
    : activeDeliverable
      ? `deliverable:${activeDeliverable.projectSlug}/${activeDeliverable.slug}`
      : activeProject
        ? `project:${activeProject.slug}`
        : `view:${view}`;
  return <div className="workspace-shell">
    <aside className={`workspace-sidebar${navOpen ? ' is-open' : ''}`}>
      <div className="brand-row"><Image alt="designRun" height={29} priority src={theme === 'light' ? '/designRun_onLight.svg' : '/designRun_onDark.svg'} width={29} /><strong>designRun</strong><div className="brand-utilities"><IconUtilityButton icon={theme === 'light' ? Moon : Sun} label={theme === 'light' ? 'Dark mode' : 'Light mode'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} /></div><UtilityButton buttonRef={mobileNavCloseRef} label="Close" onClick={() => setNavOpen(false)} /></div>
      <nav aria-label="Workspace areas">{navigation.map((item) => <button aria-current={view === item.id ? 'page' : undefined} className={view === item.id ? 'is-active' : ''} key={item.id} onClick={() => navigate(item.id)} title={item.label} type="button"><span>{item.label}</span>{item.id === 'todos' && index.stats.openTodos > 0 && <small>{index.stats.openTodos}</small>}</button>)}</nav>
      <div className="sidebar-spacer" />
      <button aria-current={view === 'guide' ? 'page' : undefined} className={`guide-nav${view === 'guide' ? ' is-active' : ''}`} onClick={() => navigate('guide')} title="Guide" type="button"><span>Guide</span></button>
      <div className="sidebar-status" title={index.diagnostics?.join('\n')}><span><i />Local workspace</span><small>{index.diagnostics?.length ? `${index.diagnostics.length} index warning${index.diagnostics.length === 1 ? '' : 's'}` : `Synced ${formatDate(index.generatedAt)}`}</small></div>
    </aside>
    {navOpen && <button aria-label="Dismiss navigation" className="mobile-scrim" onClick={() => setNavOpen(false)} type="button" />}
    <main className="workspace-main" inert={navOpen || undefined}>
      <button className="mobile-menu-trigger" onClick={() => setNavOpen(true)} ref={mobileNavOpenRef} type="button">Menu</button>
      <RefreshControlContext.Provider value={{ busy: refreshing, onRefresh: () => void refreshIndex() }}><div className="workspace-content"><div className="view-transition" key={contentKey}>{content}</div></div></RefreshControlContext.Provider>
    </main>
    <AgentCommand context={currentAgentContext()} initialTask={agentInitialTask} onClose={() => setAgentOpen(false)} onCopy={copyAgentCommand} open={agentOpen} />
    {toast && <output aria-live="polite" className="toast"><Check size={14} />{toast}</output>}
  </div>;
}
