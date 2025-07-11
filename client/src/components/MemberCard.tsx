
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MOWCUB_POSITIONS } from '@/data/memberData';

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
}

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPositionTitle = (code: string) => {
    const position = MOWCUB_POSITIONS.find(p => p.code === code);
    return position ? position.title : code;
  };

  return (
    <Card className="card-hover interactive-shadow stagger-animate">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={member.photo_url} alt={member.full_name} />
            <AvatarFallback className="bg-[#E10600] text-white">
              {getInitials(member.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {member.full_name}
            </h3>
            {member.nickname && (
              <p className="text-sm text-muted-foreground">"{member.nickname}"</p>
            )}
            
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Year:</span> {member.stateship_year}
              </p>
              <p className="text-sm">
                <span className="font-medium">Position:</span> {getPositionTitle(member.last_mowcub_position)}
              </p>
              {member.current_council_office && member.current_council_office !== 'None' && (
                <Badge variant="secondary" className="text-xs">
                  {member.current_council_office}
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <Link to={`/directory/${member.id}`}>
                <Button size="sm" className="w-full btn-animated ripple-effect">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
