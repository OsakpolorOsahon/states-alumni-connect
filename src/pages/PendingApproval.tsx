
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader className="pb-8">
              <div className="mx-auto mb-6 w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Thank You – Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-amber-800 mb-2">
                      Application Under Review
                    </h3>
                    <p className="text-amber-700 leading-relaxed">
                      Thank you for applying! Your details are under review. 
                      You'll receive an email once your membership is approved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <h3 className="font-semibold text-foreground text-lg">
                  What happens next?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      Our verification team will review your submitted documents and information
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      We'll verify your graduation year, war session, and dues payment status
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      Once approved, you'll receive an email with login instructions
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Keep an eye on your inbox
                    </h3>
                    <p className="text-blue-700 leading-relaxed">
                      The approval process typically takes 2-3 business days. 
                      Make sure to check your spam folder for our emails.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Questions about your application?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white"
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-[#E10600] hover:bg-[#E10600] hover:text-white"
                    onClick={() => window.location.href = '/'}
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
