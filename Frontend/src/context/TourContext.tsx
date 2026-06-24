import { APP_ROUTES } from '@/config/constants.ts';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TourStep {
    id: string;
    route: string;
    targetSelector: string; // matches a data-tour-id value
    title: string;
    body: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome-streak',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-streak-widget',
        title: 'Your Streak',
        body: "This is your current streak — consecutive days you've completed your daily session. Missing a session resets it to zero, so consistency matters here.",
        placement: 'right',
    },
    {
        id: 'dashboard-metrics',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-metric-grid',
        title: 'Your Stats',
        body: 'Streak, total sessions, late starts, and missed sessions — your accountability record at a glance.',
        placement: 'bottom',
    },
    {
        id: 'dashboard-trend',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-trend-chart',
        title: 'Score Trend',
        body: 'Your overall score across completed sessions over time, so you can see real progress, not just a single number.',
        placement: 'top',
    },
    {
        id: 'dashboard-risk',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-risk-matrix',
        title: 'Recurring Weaknesses',
        body: 'Topics that show up repeatedly across your sessions — this is where to focus your independent practice.',
        placement: 'left',
    },
    {
        id: 'nav-arena',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-nav-arena',
        title: 'The Interview Arena',
        body: "This is where your daily session happens — a DSA round followed by a technical round. Let's go there now.",
        placement: 'right',
    },
    {
        id: 'arena-explained',
        route: APP_ROUTES.ARENA_GATEKEEPER,
        targetSelector: 'tour-arena-entry',
        title: 'Starting Your Session',
        body: "Click this to begin today's session. You'll get 3 DSA problems first (Easy, Medium, Hard — each with its own timer), then a dynamic technical interview.",
        placement: 'bottom',
    },
    {
        id: 'nav-sync',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-nav-sync',
        title: 'Sync Launchpad',
        body: 'After completing a session, come here to link your GitHub work and generate a LinkedIn post draft based on what you actually practiced.',
        placement: 'right',
    },
    {
        id: 'nav-settings',
        route: APP_ROUTES.DASHBOARD,
        targetSelector: 'tour-nav-settings',
        title: 'Settings',
        body: 'Update your name or change your daily session time here.',
        placement: 'right',
    },
];

interface TourContextType {
    isActive: boolean;
    currentStepIndex: number;
    currentStep: TourStep | null;
    startTour: () => void;
    next: () => void;
    prev: () => void;
    endTour: () => void;
    hasSeenTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_SEEN_KEY = 'has_seen_platform_tour';

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [hasSeenTour, setHasSeenTour] = useState<boolean>(
        () => window.localStorage.getItem(TOUR_SEEN_KEY) === 'true'
    );

    const startTour = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
        navigate(TOUR_STEPS[0].route);
    }, [navigate]);

    const goToStep = useCallback(
        (index: number) => {
            const step = TOUR_STEPS[index];
            if (!step) return;
            setCurrentStepIndex(index);
            navigate(step.route);
        },
        [navigate]
    );

    const next = useCallback(() => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= TOUR_STEPS.length) {
            setIsActive(false);
            window.localStorage.setItem(TOUR_SEEN_KEY, 'true');
            setHasSeenTour(true);
            return;
        }
        goToStep(nextIndex);
    }, [currentStepIndex, goToStep]);

    const prev = useCallback(() => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex < 0) return;
        goToStep(prevIndex);
    }, [currentStepIndex, goToStep]);

    const endTour = useCallback(() => {
        setIsActive(false);
        window.localStorage.setItem(TOUR_SEEN_KEY, 'true');
        setHasSeenTour(true);
    }, []);

    const currentStep = isActive ? TOUR_STEPS[currentStepIndex] ?? null : null;

    return (
        <TourContext.Provider
            value={{ isActive, currentStepIndex, currentStep, startTour, next, prev, endTour, hasSeenTour }}
        >
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within a TourProvider.');
    }
    return context;
};