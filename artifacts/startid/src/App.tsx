import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import Home from "@/pages/Home";
import StartupProfile from "@/pages/StartupProfile";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Discover from "@/pages/Discover";
import ForStartups from "@/pages/ForStartups";
import ForInvestors from "@/pages/ForInvestors";
import ForProviders from "@/pages/ForProviders";
import Community from "@/pages/Community";
import PitchEvents from "@/pages/PitchEvents";
import Blog from "@/pages/Blog";
import Newsletter from "@/pages/Newsletter";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import FounderDashboard from "@/pages/founder/Dashboard";
import InvestorDashboard from "@/pages/investor/Dashboard";
import ProviderDashboard from "@/pages/provider/Dashboard";
import CommunityDashboard from "@/pages/community/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import Onboarding from "@/pages/Onboarding";
import PendingApproval from "@/pages/PendingApproval";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/not-found";
import InvestorProfile from "@/pages/InvestorProfile";
import ProviderProfile from "@/pages/ProviderProfile";
import CommunityProfile from "@/pages/CommunityProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/for-startups" component={ForStartups} />
      <Route path="/for-investors" component={ForInvestors} />
      <Route path="/for-providers" component={ForProviders} />
      <Route path="/community" component={Community} />
      <Route path="/pitch-events" component={PitchEvents} />
      <Route path="/blog" component={Blog} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/about" component={About} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/startups/:slug" component={StartupProfile} />
      <Route path="/investors/:slug" component={InvestorProfile} />
      <Route path="/providers/:slug" component={ProviderProfile} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/founder/dashboard" component={FounderDashboard} />
      <Route path="/founder/profile" component={FounderDashboard} />
      <Route path="/founder/pipeline" component={FounderDashboard} />
      <Route path="/investor/dashboard" component={InvestorDashboard} />
      <Route path="/investor/profile" component={InvestorDashboard} />
      <Route path="/investor/discover" component={InvestorDashboard} />
      <Route path="/investor/dealflow" component={InvestorDashboard} />
      <Route path="/investor/commitments" component={InvestorDashboard} />
      <Route path="/provider/dashboard" component={ProviderDashboard} />
      <Route path="/provider/profile" component={ProviderDashboard} />
      <Route path="/provider/leads" component={ProviderDashboard} />
      <Route path="/community/dashboard" component={CommunityDashboard} />
      <Route path="/community/profile" component={CommunityDashboard} />
      <Route path="/community/following" component={CommunityDashboard} />
      <Route path="/community/events" component={CommunityDashboard} />
      <Route path="/community/explore" component={CommunityDashboard} />
      <Route path="/community/:slug" component={CommunityProfile} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/pending-approval" component={PendingApproval} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
