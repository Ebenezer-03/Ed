import { useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { CourseSource, SourceStatus } from '../types/edustar';

interface SourcesPanelProps {
  sources: CourseSource[];
  selectedSourceId: string | null;
  onSelectSource: (source: CourseSource) => void;
  onCreateSource: (draft: Omit<CourseSource, 'id' | 'updatedAt'>) => void;
  onUpdateSource: (id: string, patch: Partial<CourseSource>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteSource: (id: string) => void;
  isHiddenOnMobile?: boolean;
}

interface SourceFormState {
  title: string;
  unit: string;
  pageLabel: string;
  section: string;
  format: 'PDF' | 'MD' | 'DOCX';
  status: SourceStatus;
  content: string;
}

const EMPTY_FORM: SourceFormState = {
  title: '',
  unit: 'Unit 7',
  pageLabel: 'Page 1',
  section: '',
  format: 'PDF',
  status: 'PENDING',
  content: '',
};

export function SourcesPanel({
  sources,
  selectedSourceId,
  onSelectSource,
  onCreateSource,
  onUpdateSource,
  onToggleStatus,
  onDeleteSource,
  isHiddenOnMobile = false,
}: SourcesPanelProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SourceStatus>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SourceFormState>(EMPTY_FORM);

  const filtered = sources.filter((src) => {
    const matchesStatus = statusFilter === 'ALL' || src.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      src.title.toLowerCase().includes(q) ||
      src.section.toLowerCase().includes(q) ||
      src.unit.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowCreate(true);
  };

  const startEdit = (src: CourseSource) => {
    setShowCreate(false);
    setEditingId(src.id);
    setForm({
      title: src.title,
      unit: src.unit,
      pageLabel: src.pageLabel,
      section: src.section,
      format: src.format,
      status: src.status,
      content: src.content,
    });
  };

  const cancelForm = () => {
    setShowCreate(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      onUpdateSource(editingId, {
        title: form.title.trim(),
        unit: form.unit.trim() || 'Unit',
        pageLabel: form.pageLabel.trim() || 'Page 1',
        section: form.section.trim() || 'Course Notes',
        format: form.format,
        status: form.status,
        content: form.content.trim(),
      });
    } else {
      onCreateSource({
        title: form.title.trim(),
        unit: form.unit.trim() || 'Unit',
        pageLabel: form.pageLabel.trim() || 'Page 1',
        section: form.section.trim() || 'Course Notes',
        format: form.format,
        status: form.status,
        content: form.content.trim(),
      });
    }
    cancelForm();
  };

  const approvedCount = sources.filter((s) => s.status === 'APPROVED').length;

  return (
    <aside
      className={`pane ${isHiddenOnMobile ? 'is-mobile-hidden' : ''}`}
      aria-label="Course sources"
    >
      <div className="pane__head">
        <h2 className="pane__title">
          <FileText size={16} /> Sources ({approvedCount}/{sources.length})
        </h2>
        <button
          type="button"
          className="btn btn--sm btn--primary"
          onClick={startCreate}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="sources-controls">
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            className="input"
            style={{ paddingLeft: 30 }}
            placeholder="Filter notes or units..."
            aria-label="Filter sources"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row" role="group" aria-label="Source status filter">
          {(['ALL', 'APPROVED', 'PENDING'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`chip-tab ${statusFilter === tab ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab === 'ALL' ? 'All' : tab === 'APPROVED' ? 'Approved' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      <div className="pane__body">
        {(showCreate || editingId) && (
          <form className="source-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 13 }}>
                {editingId ? 'Edit study source' : 'Upload study source'}
              </strong>
              <button
                type="button"
                className="icon-btn"
                onClick={cancelForm}
                aria-label="Cancel source form"
              >
                <X size={13} />
              </button>
            </div>

            <input
              type="text"
              className="input"
              placeholder="File title (e.g. Unit 6 Networking.pdf)"
              aria-label="Source title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="source-form__row">
              <input
                type="text"
                className="input"
                placeholder="Unit (e.g. Unit 6)"
                aria-label="Source unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <input
                type="text"
                className="input"
                placeholder="Page (e.g. Page 74)"
                aria-label="Source page"
                value={form.pageLabel}
                onChange={(e) => setForm({ ...form, pageLabel: e.target.value })}
              />
            </div>

            <div className="source-form__row">
              <input
                type="text"
                className="input"
                placeholder="Section heading"
                aria-label="Source section"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
              <select
                className="input"
                aria-label="Source format"
                value={form.format}
                onChange={(e) =>
                  setForm({
                    ...form,
                    format: e.target.value as 'PDF' | 'MD' | 'DOCX',
                  })
                }
              >
                <option value="PDF">PDF</option>
                <option value="MD">MD</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>

            <textarea
              className="textarea"
              placeholder="Paste approved notes, definitions, or formulas..."
              aria-label="Source content"
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <div className="source-form__actions">
              <button type="button" className="btn btn--sm" onClick={cancelForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn--sm btn--primary">
                {editingId ? 'Save Changes' : 'Save Source'}
              </button>
            </div>
          </form>
        )}

        <div className="source-list">
          {filtered.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '12px 0' }}>
              No matching sources. Add notes or switch filter.
            </p>
          ) : (
            filtered.map((src) => (
              <div
                key={src.id}
                className={`source-card ${
                  selectedSourceId === src.id ? 'is-selected' : ''
                } ${src.status === 'PENDING' ? 'is-pending' : ''}`}
              >
                <div className="source-card__top">
                  <button
                    type="button"
                    className="source-card__title"
                    onClick={() => onSelectSource(src)}
                  >
                    {src.title}
                  </button>
                  <span
                    className={`badge ${
                      src.status === 'APPROVED' ? 'badge--approved' : 'badge--pending'
                    }`}
                  >
                    {src.status === 'APPROVED' ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Clock3 size={11} />
                    )}
                    {src.status === 'APPROVED' ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div className="source-card__meta">
                  <span className="mono">{src.format}</span>
                  <span>·</span>
                  <span>{src.unit}</span>
                  <span>·</span>
                  <span>{src.pageLabel}</span>
                  <span>·</span>
                  <span>{src.section}</span>
                </div>

                <div className="source-card__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onToggleStatus(src.id)}
                  >
                    {src.status === 'APPROVED' ? 'Revoke' : 'Approve'}
                  </button>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Edit ${src.title}`}
                      onClick={() => startEdit(src)}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Delete ${src.title}`}
                      onClick={() => onDeleteSource(src.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
