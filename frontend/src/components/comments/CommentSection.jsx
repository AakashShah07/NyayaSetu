import { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { getComments, createComment, deleteComment } from '../../api/comments';
import toast from 'react-hot-toast';

export default function CommentSection({ entityType, entityId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(entityType, entityId);
      setComments(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await createComment({ body: body.trim(), entityType, entityId });
      setBody('');
      await fetchComments();
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        Comments ({comments.length})
      </h4>

      {/* Comment list */}
      {loading ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="flex-1 resize-none rounded-md border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <Button type="submit" variant="primary" size="sm" disabled={submitting || !body.trim()}>
          {submitting ? '...' : 'Post'}
        </Button>
      </form>
    </div>
  );
}
