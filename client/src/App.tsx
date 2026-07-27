import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import PortfolioCreate from "@/pages/PortfolioCreate";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Stories from "@/pages/Stories";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Main Routes */}
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/portfolio/create" component={PortfolioCreate} />
      <Route path="/profile" component={Profile} />
      <Route path="/search" component={Search} />
      <Route path="/stories" component={Stories} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
