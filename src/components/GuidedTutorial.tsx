import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext.tsx';

const tutorialSteps = [
  {
    title: 'tutorial_step1_title',
    text: 'tutorial_step1_text',
    highlight: '.summary-panel',
  },
  {
    title: 'tutorial_step2_title',
    text: 'tutorial_step2_text',
    highlight: '.pairwise-panel',
  },
  {
    title: 'tutorial_step3_title',
    text: 'tutorial_step3_text',
    highlight: '.matrix-panel',
  },
];

const GuidedTutorial = () => {
  const { setIntroductionSeen } = useAppContext();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const currentStep = tutorialSteps[step];

  const goToNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      setIntroductionSeen(true);
    }
  };

  const goToPrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t(currentStep.title)}</h2>
          <button className="modal-close-btn" onClick={() => setIntroductionSeen(true)}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{t(currentStep.text)}</p>
        </div>
        <div className="modal-footer">
          {step > 0 && <button className="btn" onClick={goToPrevious}>{t('previous')}</button>}
          <button className="btn btn-primary" onClick={goToNext}>
            {step < tutorialSteps.length - 1 ? t('next') : t('finish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTutorial;
