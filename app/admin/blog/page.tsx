'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id:           number;
  title:        string;
  slug:         string;
  category:     string;
  published:    boolean;
  published_at: string | null;
  created_at:   string;
}

function fmtDate(val: string | null): string {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function BlogListPage() {
  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function fetchPosts() {
    try {
      const res  = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setMessage({ type: 'err', text: 'Could not load posts.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleTogglePublish(post: Post) {
    try {
      const res = await fetch('/api/admin/blog', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (res.ok) {
        setPosts(ps => ps.map(p =>
          p.id === post.id ? { ...p, published: !p.published } : p
        ));
      } else {
        setMessage({ type: 'err', text: 'Failed to update post.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/blog', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      if (res.ok) {
        setPosts(ps => ps.filter(p => p.id !== id));
        setMessage({ type: 'ok', text: 'Post deleted.' });
      } else {
        setMessage({ type: 'err', text: 'Delete failed.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    }
  }

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Blog Posts</h1>
        <Link href="/admin/blog/new" className="mk-admin-btn mk-admin-btn--gold">
          New Post
        </Link>
      </div>
      <p className="mk-admin-subtitle">{posts.length} post{posts.length !== 1 ? 's' : ''} total.</p>

      {message && (
        <div className={`mk-admin-alert mk-admin-alert--${message.type === 'ok' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="mk-admin-section" style={{ marginTop: 'var(--s-4)', padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p className="mk-admin-muted" style={{ padding: 'var(--s-6)' }}>Loading…</p>
        ) : posts.length === 0 ? (
          <p className="mk-admin-muted" style={{ padding: 'var(--s-6)' }}>No posts yet. <Link href="/admin/blog/new" className="mk-admin-link">Write one.</Link></p>
        ) : (
          <div className="mk-admin-table-wrap">
            <table className="mk-admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="mk-admin-table-row">
                    <td>
                      <Link href={`/admin/blog/${post.id}/edit`} className="mk-admin-link">
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className="mk-admin-category-tag">{post.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span className={`mk-admin-status mk-admin-status--${post.published ? 'published' : 'draft'}`}>
                          {post.published ? 'Live' : 'Draft'}
                        </span>
                        <label className="mk-admin-toggle" title={post.published ? 'Click to unpublish' : 'Click to publish'}>
                          <input
                            type="checkbox"
                            checked={post.published}
                            onChange={() => handleTogglePublish(post)}
                            className="mk-admin-toggle__input"
                          />
                          <span className="mk-admin-toggle__track" />
                        </label>
                      </div>
                    </td>
                    <td className="mk-admin-muted">{fmtDate(post.published_at)}</td>
                    <td className="mk-admin-muted">{fmtDate(post.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link href={`/admin/blog/${post.id}/edit`} className="mk-admin-btn-text">
                          Edit
                        </Link>
                        <button
                          className="mk-admin-btn-text mk-admin-btn-text--plum"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
