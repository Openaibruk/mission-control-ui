'use client';

import { cn, formatTimeAgo, getThemeClasses } from '@/lib/utils';
import { Activity as ActivityType } from '@/lib/types';
import { Activity, RefreshCw } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityType[];
  theme: 'dark' | 'light';
  loading?: boolean;
}

export default function ActivityFeed({ activities, theme, loading }: ActivityFeedProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-5 h-5 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border p-4", classes.card)}>
      <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", classes.heading)}>
        <Activity className="w-4 h-4" /> Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p className={cn("text-sm", classes.muted)}>No recent activity</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className={cn("flex items-start gap-2 text-sm", classes.text)}>
              <span className="shrink-0 mt-0.5">{activity.agents?.avatar_emoji || '🤖'}</span>
              <div className="min-w-0 flex-1">
                <span className="font-medium">{activity.agents?.name || activity.agent_id}</span>
                {' '}
                <span className={classes.muted}>{activity.action}</span>
                {activity.details && (
                  <span className={cn("block text-xs truncate", classes.muted)}>{activity.details}</span>
                )}
              </div>
              <span className={cn("text-xs shrink-0 ml-auto", classes.muted)}>
                {formatTimeAgo(activity.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
