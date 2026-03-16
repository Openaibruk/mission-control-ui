'use client';

import { useEffect, useRef } from 'react';
import { Activity } from '@/lib/types';
import { cn, getAvatar, timeAgo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Activity as ActivityIcon } from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  theme: 'dark' | 'light';
}

export function ActivityFeed({ activities, loading, theme }: ActivityFeedProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new activities
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activities]);

  if (loading) {
    return (
      <div>
        <h3 className={cn("text-[14px] font-semibold mb-4", classes.heading)}>Live Activity Feed</h3>
        <div className={cn("h-[300px] flex flex-col rounded-lg animate-pulse", classes.card)}>
          <div className="flex-1 p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className={cn("w-6 h-6 rounded-full", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                <div className="flex-1">
                  <div className={cn("h-4 w-24 rounded mb-1", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                  <div className={cn("h-3 w-48 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
                </div>
              </div>
            ))}
          </div>
          <div className={cn("px-4 py-3 border-t text-[11px] text-center", classes.divider, classes.muted)}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className={cn("text-[14px] font-semibold mb-4", classes.heading)}>Live Activity Feed</h3>
      <div className={cn("h-[300px] flex flex-col rounded-lg overflow-hidden", classes.card)}>
        <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ActivityIcon className={cn("w-8 h-8 mb-2", classes.muted)} />
              <p className={cn("text-[12px]", classes.muted)}>No activities yet</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={cn(
                  "flex items-start space-x-3 text-[13px] transition-all",
                  isDark ? "text-neutral-300" : "text-neutral-700",
                  index === activities.length - 1 && "font-medium"
                )}
              >
                <img 
                  src={getAvatar(activity.agent_name)} 
                  alt={activity.agent_name}
                  className="w-6 h-6 rounded-full border border-neutral-700 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-violet-400 font-semibold">@{activity.agent_name}</span>
                  <span className={cn("ml-1", classes.muted)}>{activity.action}</span>
                </div>
                <span className={cn("text-[10px] shrink-0", classes.subtle)}>
                  {timeAgo(activity.created_at)}
                </span>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>
        <div className={cn(
          "px-4 py-3 border-t text-[11px] text-center",
          classes.divider,
          classes.muted
        )}>
          Streaming real-time events...
        </div>
      </div>
    </div>
  );
}