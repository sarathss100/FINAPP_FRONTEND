import { ControlYourFinancialFutureSection } from './ControlYourFinancialFutureSection/ControlYourFinancialFutureSection'
import { FeaturesSection } from './FeaturesSection/FeaturesSection';
import { FinancialCommandCenterSection } from './FinancialCommandCenterSection/FinancialCommandCenterSection';
import { FinancialJourneySection } from './FinancialJourneySection/FinancialJourneySection';
import { InvestmentCategoriesSection } from './InvestmentCatgoriesSection/InvestmentCategoriesSection';
import { MainContentSection } from './MainContentSection/MainContentSection';
import { PlanningGoalsSection } from './PlanningGoalsSection/PlanningGoalsSection';

const LandingPageBody = function () {
    return (
        <>
            {/* Control Your Financial Future Section */}
            <ControlYourFinancialFutureSection />

            {/* Financial Command Center Section */}
            <FinancialCommandCenterSection />

            {/* Main Content Section */}
            <MainContentSection />

            {/* Features Section */}
            <FeaturesSection />
            
            {/* Investment Categories Section */}
            <InvestmentCategoriesSection />

            {/* Planning Goals Section */}
            <PlanningGoalsSection />

            {/* Financial Journey Section */}
            <FinancialJourneySection />
        </>
    )
}

export default LandingPageBody;
