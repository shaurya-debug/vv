import React from 'react';
import {
  Compass,
  Shield,
  Gem,
  Sparkles,
  Sun,
  Coins,
  BookOpen,
  Flame,
  HeartHandshake,
  Sword,
  Heart,
  Briefcase,
  Calendar,
  Moon,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Star,
  Users,
  Award,
  Scroll,
} from 'lucide-react';

interface VedicIconProps {
  name: string;
  className?: string;
}

export const VedicIcon: React.FC<VedicIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Compass':
      return <Compass className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Gem':
      return <Gem className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Sword':
      return <Sword className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Phone':
      return <Phone className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Scroll':
      return <Scroll className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
