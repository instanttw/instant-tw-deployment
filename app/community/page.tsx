"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { toast } from "sonner";

export default function CommunityPage() {
  const { status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch('/api/community/posts');
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    };
    load();
  }, []);

  const submitPost = async () => {
    if (!title || !content) { toast.error('Title and content are required'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setTitle(''); setContent('');
      const list = await fetch('/api/community/posts').then(r=>r.json());
      setPosts(list.posts || []);
      toast.success('Post created');
    } catch (e:any) {
      toast.error(e?.message || 'Failed to create post');
    } finally { setCreating(false); }
  };

  return (
    <SidebarLayout type="user">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Community Forum</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
            <CardDescription>Share questions, tips, or ideas with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />
            <Textarea placeholder="Write your content..." value={content} onChange={e=>setContent(e.target.value)} className="min-h-[120px]" />
            <Button onClick={submitPost} disabled={creating || status!=="authenticated"}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Publish
            </Button>
            {status!=="authenticated" && <p className="text-xs text-muted-foreground">Sign in to create a post</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Be the first to create one.</p>
          ) : (
            posts.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="text-lg"><Link href={`/community/${p.id}`}>{p.title}</Link></CardTitle>
                  <CardDescription>{new Date(p.created_at).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
