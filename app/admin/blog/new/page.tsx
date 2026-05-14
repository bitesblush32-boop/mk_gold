'use client';

import BlogEditor from '@/components/admin/BlogEditor';

export default function NewBlogPostPage() {
  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">New Blog Post</h1>
      </div>
      <BlogEditor mode="new" />
    </div>
  );
}
