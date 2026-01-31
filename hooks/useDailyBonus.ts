import { useState, useEffect } from 'react';

const BONUS_KEY = 'lastBonusClaimDate';
const BONUS_AMOUNT = 100;

export const useDailyBonus = () => {
    const [isEligible, setIsEligible] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [canClaim, setCanClaim] = useState(false);

    useEffect(() => {
        const checkEligibility = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            
            // Check time window: 06:00 to 07:00 (inclusive of 06:xx, exclusive of 07:01)
            // Strict interpretation: 06:00:00 to 06:59:59
            const isTimeWindow = currentHour === 6; 
            
            const todayStr = now.toDateString();
            const lastClaimDate = localStorage.getItem(BONUS_KEY);
            const alreadyClaimed = lastClaimDate === todayStr;

            if (alreadyClaimed) {
                setIsEligible(false);
                setCanClaim(false);
                setStatusMessage('Bônus de hoje já resgatado! Volte amanhã às 06:00.');
                return;
            }

            if (isTimeWindow) {
                setIsEligible(true);
                setCanClaim(true);
                setStatusMessage('Horário Nobre! Resgate seu bônus agora.');
            } else {
                setIsEligible(false);
                setCanClaim(false);
                if (currentHour < 6) {
                //    setStatusMessage('O bônus estará disponível às 06:00. Durma bem (ou não)!');
                } else {
                   
                }
            }
        };

        checkEligibility();
        const timer = setInterval(checkEligibility, 60000); // Check every minute

        return () => clearInterval(timer);
    }, []);

    const claimBonus = (onSuccess: (amount: number) => void) => {
        if (!canClaim) return;
        
        const now = new Date();
        localStorage.setItem(BONUS_KEY, now.toDateString());
        
        setCanClaim(false);
        setIsEligible(false);
        setStatusMessage('Bônus resgatado com sucesso!');
        
        onSuccess(BONUS_AMOUNT);
    };

    return {
        isEligible,
        canClaim,
        statusMessage,
        claimBonus
    };
};
