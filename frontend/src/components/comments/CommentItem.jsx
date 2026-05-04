import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?._id === comment.author?._id || user?.role === 'admin';

  return (
    <div className="flex gap-3 border-b pb-3 last:border-0 dark:border-gray-700">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
        {comment.author?.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.author?.name || 'Unknown'}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.body}</p>
        {comment.mentions?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {comment.mentions.map((m) => (
              <span key={m._id} className="text-xs text-indigo-600 dark:text-indigo-400">@{m.name}</span>
            ))}
          </div>
        )}
      </div>
      {isOwner && (
        <button
          onClick={() => onDelete(comment._id)}
          className="shrink-0 text-gray-400 hover:text-red-500"
          title="Delete comment"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
