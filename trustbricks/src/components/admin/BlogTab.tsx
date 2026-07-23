import { createBlogPost } from "@/app/actions/blogActions";
import BlogEditForm from "@/components/BlogEditForm";
import { Plus } from "lucide-react";

export default function BlogTab({ posts }: { posts: any[] }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Blog</h2>
        <p className="text-slate-500 text-xs mt-0.5">Posts shown on /insights. Slug auto-generates from the title if left blank.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
          <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>New Post</h3>
          <form action={async (formData) => { 'use server'; await createBlogPost(formData); }} className="space-y-3">
            <input name="title" required placeholder="Title" className={inputClass} />
            <input name="slug" placeholder="URL slug (auto from title if blank)" className={inputClass} />
            <input name="excerpt" placeholder="Short excerpt" className={inputClass} />
            <textarea name="body" required placeholder="Post content" rows={6} className={`${inputClass} resize-y font-mono text-sm`} />
            <input name="authorName" defaultValue="Trust Bricks Team" placeholder="Author name" className={inputClass} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Cover image: <input type="file" name="coverImage" accept="image/*" className="text-xs" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="published" className="rounded" /> Publish immediately
            </label>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
              <Plus className="w-4 h-4" /> Create Post
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Posts ({posts?.length || 0})</span>
          </div>
          <div className="divide-y divide-slate-100">
            {!posts || posts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No posts yet.</div>
            ) : (
              posts.map((p: any) => <BlogEditForm key={p.id} post={p} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
