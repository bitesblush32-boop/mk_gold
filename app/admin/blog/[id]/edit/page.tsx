'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import BlogEditor, { type BlogEditorPost } from '@/components/admin/BlogEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: Props) {
  const { id } = use(params);

  const [post,    setPost]    = useState<BlogEditorPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`/api/admin/blog?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.post) {
          setPost({
            id:              d.post.id,
            title:           d.post.title,
            slug:            d.post.slug,
            excerpt:         d.post.excerpt ?? '',
            body_json:       d.post.body_json ?? '',
            category:        d.post.category ?? 'Guide',
            cover_image_url: d.post.cover_image_url ?? '',
            published:       d.post.published ?? false,
          });
        } else {
          setError('Post not found.');
        }
      })
      .catch(() => setError('Could not load post.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Edit Post</h1>
      </div>

      {loading && <p className="mk-admin-muted" style={{ padding: 'var(--s-6)' }}>Loading…</p>}
      {error   && <div className="mk-admin-alert mk-admin-alert--error">{error}</div>}
      {post    && <BlogEditor mode="edit" initialValues={post} />}
    </div>
  );
}
