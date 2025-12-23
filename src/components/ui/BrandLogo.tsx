'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';

interface BrandLogoProps {
    className?: string;
    size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = 32 }) => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return <div className={cn("rounded-full bg-slate-200 animate-pulse", className)} style={{ width: size, height: size }} />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="relative group flex items-center justify-center">
            {/* Theme Indicator Tooltip-like effect */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    key={isDark ? 'dark' : 'light'}
                    className="absolute -top-10 px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl pointer-events-none z-50 whitespace-nowrap"
                >
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                </motion.div>
            </AnimatePresence>

            <motion.div
                whileTap={{ scale: 0.8, rotate: -15 }}
                whileHover={{ scale: 1.1 }}
                onClick={toggleTheme}
                className={cn(
                    "relative cursor-pointer transition-all duration-300 p-3 rounded-[1.5rem] flex items-center justify-center z-10",
                    isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-100 hover:bg-slate-200",
                    className
                )}
            >
                <div className="relative">
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M26 10C31.5228 10 36 14.4772 36 20C36 25.5228 31.5228 30 26 30C23.5117 30 21.2312 29.0886 19.4922 27.5859L19.4688 27.5625L10.5 31.5L4 25L7.9375 18.5312L7.91406 18.5078C6.41138 16.7688 5.5 14.4883 5.5 12C5.5 6.47715 9.97715 2 15.5 2C21.0228 2 25.5 6.47715 25.5 12L25.4961 12.5"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <motion.circle
                            animate={{ scale: isDark ? 1.2 : 1 }}
                            cx="26"
                            cy="20"
                            r="6"
                            className={cn(isDark ? "fill-primary" : "fill-primary/20")}
                        />
                        <motion.circle
                            animate={{ scale: !isDark ? 1.2 : 1 }}
                            cx="14"
                            cy="14"
                            r="6"
                            className={cn(!isDark ? "fill-accent" : "fill-accent/20")}
                        />
                    </svg>

                    {/* Micro Floating Switch Icons */}
                    <div className="absolute -top-1 -right-1">
                        {isDark ? (
                            <Moon className="w-4 h-4 text-primary fill-primary" />
                        ) : (
                            <Sun className="w-4 h-4 text-accent fill-accent" />
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
