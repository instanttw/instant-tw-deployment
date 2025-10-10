"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { toast } from "sonner";

export default function CommunityPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { status } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const p = await fetch(`/api/community/posts/${id}`).then(r=>r.json());
    setPost(p.post);
    const c = await fetch(`/api/community/posts/${id}/comments`).then(r=>r.json());
    setComments(c.comments||[]);
    setLoading(false);
  };

  useEffect(() => { if (id) load(); }, [id]);

  const addComment = async () => {
    if (!comment) { toast.error('Enter a comment'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: comment }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setComment('');
      await load();
    } catch (e:any) {
      toast.error(e?.message || 'Failed to add comment');
    } finally { setSubmitting(false); }
  };

  return (
    <SidebarLayout type="user">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !post ? (
          <p>Post not found</p>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{new Date(post.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  comments.map((c:any) => (
                    <div key={c.id} className="rounded border p-3">
                      <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add a Comment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea placeholder="Write your comment..." value={comment} onChange={e=>setComment(e.target.value)} />
                <Button onClick={addComment} disabled={submitting || status!=="authenticated"}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  Post Comment
                </Button>
                {status!=="authenticated" && <p className="text-xs text-muted-foreground">Sign in to comment</p>}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
