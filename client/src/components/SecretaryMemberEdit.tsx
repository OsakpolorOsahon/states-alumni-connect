
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Member {
  id: string;
  fullName: string;
  nickname?: string;
  lastMowcubWarSession: string;
  lastMowcubPosition: string;
  currentCouncilOffice?: string;
  profilePhoto: string;
}

interface SecretaryMemberEditProps {
  member: Member;
  onUpdate: (memberId: string, updates: Partial<Member>) => void;
  onCancel: () => void;
}

const SecretaryMemberEdit = ({ member, onUpdate, onCancel }: SecretaryMemberEditProps) => {
  const [editingMember, setEditingMember] = useState<Member>({ ...member });

  const mowcubPositions = [
    "None",
    "President (PRES)",
    "Vice President (VP)",
    "Secretary General (SEC-GEN)",
    "Assistant Secretary General (ASST SEC-GEN)",
    "Financial Secretary (FIN-SEC)",
    "Treasurer (TREAS)",
    "Director of Socials (DOS)",
    "Public Relations Officer (PRO)",
    "Welfare Officer (WO)",
    "Squad Leader Alpha (SL-A)",
    "Squad Leader Bravo (SL-B)",
    "Squad Leader Charlie (SL-C)",
    "Assistant Squad Leader Alpha (ASL-A)",
    "Assistant Squad Leader Bravo (ASL-B)",
    "Assistant Squad Leader Charlie (ASL-C)"
  ];

  const councilOffices = [
    "None",
    "President (PRES)",
    "Vice President (VP)",
    "Secretary General (SEC-GEN)",
    "Assistant Secretary General (ASST SEC-GEN)",
    "Financial Secretary (FIN-SEC)",
    "Treasurer (TREAS)",
    "Director of Socials (DOS)",
    "Public Relations Officer (PRO)",
    "Welfare Officer (WO)",
    "Legal Advisor (LA)",
    "Publicity Secretary (PUB-SEC)",
    "Ex-Officio Member (EX-OFF)"
  ];

  const handleSave = () => {
    onUpdate(member.id, {
      lastMowcubPosition: editingMember.lastMowcubPosition,
      currentCouncilOffice: editingMember.currentCouncilOffice
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto dark:bg-card dark:border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground dark:text-foreground">
          Edit Member Details
        </CardTitle>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          {member.fullName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last MOWCUB Position */}
        <div className="space-y-2">
          <Label htmlFor="lastMowcubPosition" className="text-sm font-medium dark:text-foreground">
            Last MOWCUB Position
          </Label>
          <Select 
            value={editingMember.lastMowcubPosition} 
            onValueChange={(value) => setEditingMember(prev => ({ ...prev, lastMowcubPosition: value }))}
          >
            <SelectTrigger className="dark:bg-background dark:border-border dark:text-foreground">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="dark:bg-popover dark:border-border">
              {mowcubPositions.map(position => (
                <SelectItem key={position} value={position} className="dark:text-foreground dark:focus:bg-accent">
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Council Office */}
        <div className="space-y-2">
          <Label htmlFor="currentCouncilOffice" className="text-sm font-medium dark:text-foreground">
            Current Council Office
          </Label>
          <Select 
            value={editingMember.currentCouncilOffice || "none"} 
            onValueChange={(value) => setEditingMember(prev => ({ 
              ...prev, 
              currentCouncilOffice: value === "none" ? null : value
            }))}
          >
            <SelectTrigger className="dark:bg-background dark:border-border dark:text-foreground">
              <SelectValue placeholder="Select office" />
            </SelectTrigger>
            <SelectContent className="dark:bg-popover dark:border-border">
              <SelectItem value="none" className="dark:text-foreground dark:focus:bg-accent">
                No Office
              </SelectItem>
              {councilOffices.map(office => (
                <SelectItem key={office} value={office} className="dark:text-foreground dark:focus:bg-accent">
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-[#E10600] hover:bg-[#C10500] text-white"
          >
            Save Changes
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 dark:border-border dark:text-foreground dark:hover:bg-accent"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecretaryMemberEdit;
