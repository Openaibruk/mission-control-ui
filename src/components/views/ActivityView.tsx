'use client';

import { cn, formatTimeAgo, getThemeClasses } from '@/lib/utils';
import { Activity as ActivityType } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityType[];
  theme: 'dark' | 'light';
  loading?: boolean;
}

export default function ActivityView({ activities, theme, loading }: ActivityViewProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-neutral-500" /></div>;
  }

  return (
    <div className="space-y-4">
      <h2 className={cn("text-lg font-semibold", classes.heading)}>Activity Log</h2>
      <div className={cn("rounded-xl border divide-y", classes.card, isDark ? "divide-neutral-800" : "divide-neutral-200")}>
        {activities.length === 0 ? (
          <div className="p-6 text-center">
            <p className={cn("text-sm", classes.muted)}>No activity recorded</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-4">
              <span className="text-lg shrink-0">{activity.agents?.avatar_emoji || '🤖'}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className={cn("font-medium", classes.heading)}>{activity.agents?.name || activity.agent_id}</span>
                  {' '}
                  <span className={classes.text}>{activity.action}</span>
                </div>
                {activity.details && (
                  <p className={cn("text-xs mt-0.5 truncate", classes.muted)}>{activity.details}</p>
                )}
              </div>
              <span className={cn("text-xs shrink-0", classes.muted)}>{formatTimeAgo(activity.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
