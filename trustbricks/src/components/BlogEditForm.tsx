"use client";

import { useState } from "react";
import { updateBlogPost, deleteBlogPost } from "@/app/actions/blogActions";
import { Trash, Pencil, X, Check, FileText } from "lucide-react";

interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  authorName: string;
  published: boolean;
}

export default function BlogEditForm({ post }: { post: BlogPostRecord }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    await updateBlogPost(post.id, formData);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <div className="flex items-center gap-2">
          {post.coverImage && <img src={post.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
            <FileText className="w-4 h-4 text-slate-400" /> {post.title}
          </h4>
          {!post.published && <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-bold rounded uppercase">Draft</span>}
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-2 space-y-2">
            <input name="title" defaultValue={post.title} placeholder="Title" required className={inputClass} />
            <input name="slug" defaultValue={post.slug} placeholder="URL slug (auto from title if blank)" className={inputClass} />
            <input name="excerpt" defaultValue={post.excerpt} placeholder="Short excerpt" className={inputClass} />
            <textarea name="body" defaultValue={post.body} placeholder="Post content" rows={6} required className={`${inputClass} resize-y font-mono text-sm`} />
            <input name="authorName" defaultValue={post.authorName} placeholder="Author name" className={inputClass} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Cover image: <input type="file" name="coverImage" accept="image/*" className="text-xs" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="published" defaultChecked={post.published} className="rounded" /> Published
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-[#0D1F3C] text-white text-[10px] font-bold rounded-lg hover:bg-[#1E3A5F] transition-colors cursor-pointer disabled:opacity-50">
                <Check className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs text-slate-500">/insights/{post.slug} · by {post.authorName}</p>
            <p className="text-xs text-slate-500 line-clamp-2">{post.excerpt}</p>
          </>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-[#E8600A] hover:bg-orange-50 rounded-xl transition-all cursor-pointer" aria-label={`Edit ${post.title}`}>
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <form action={async () => { await deleteBlogPost(post.id); }}>
          <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" aria-label={`Remove ${post.title}`}>
            <Trash className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
