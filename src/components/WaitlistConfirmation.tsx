
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Trophy, 
  Star, 
  Users, 
  Share2, 
  Copy, 
  Gift,
  Info,
  ChevronDown,
  QrCode,
  Mail,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface WaitlistData {
  id: string;
  email: string;
  referral_code: string;
  points: number;
  waitlist_position: number;
  referral_count: number;
  discord_joined: boolean;
}

interface WaitlistConfirmationProps {
  onClose?: () => void;
  isMobile?: boolean;
  waitlistData?: WaitlistData;
}

const WaitlistConfirmation: React.FC<WaitlistConfirmationProps> = ({ 
  onClose, 
  isMobile = false, 
  waitlistData 
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleDiscordJoin = async () => {
    // For anonymous users, just open Discord link
    window.open('https://discord.gg/chyll', '_blank');
    toast.info('Rejoignez notre Discord pour obtenir des points bonus !');
  };

  const getReferralUrl = () => {
    if (!waitlistData) return '';
    return `${window.location.origin}/waitlist-subscription?ref=${waitlistData.referral_code}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralUrl());
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent('🚀 Je viens de rejoindre la liste d\'attente de chyll.ai ! Rejoignez-moi et passez devant dans la file 👇');
    const url = encodeURIComponent(getReferralUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(getReferralUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`🚀 Je viens de rejoindre la liste d'attente de chyll.ai ! Rejoignez-moi : ${getReferralUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`🚀 Je viens de rejoindre la liste d'attente de chyll.ai ! Rejoignez-moi : ${getReferralUrl()}`);
    window.open(`https://t.me/share/url?url=${getReferralUrl()}&text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getReferralUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnReddit = () => {
    const title = encodeURIComponent('Rejoignez la liste d\'attente de chyll.ai');
    const url = encodeURIComponent(getReferralUrl());
    window.open(`https://reddit.com/submit?title=${title}&url=${url}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent('Rejoignez-moi sur la liste d\'attente de chyll.ai');
    const body = encodeURIComponent(`Salut !\n\nJe viens de rejoindre la liste d'attente de chyll.ai et j'aimerais que tu me rejoignes.\n\nRejoins-moi ici : ${getReferralUrl()}\n\nÀ bientôt !`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getReferralUrl())}`;
    window.open(qrUrl, '_blank');
  };

  if (!waitlistData) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Erreur lors du chargement des données</p>
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Confirmation Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">
          Félicitations, vous êtes sur la liste d'attente ! 🎉
        </h1>
      </div>

      {/* Stats Row */}
      <div className="flex justify-center items-center gap-8">
        <TooltipProvider>
          <div className="flex flex-col items-center">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Position</span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Position mise à jour quotidiennement basée sur le total des points et le nombre de parrainages</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="secondary" className="text-lg font-bold">
                #{waitlistData.waitlist_position}
              </Badge>
            </div>
          </div>
        </TooltipProvider>

        <div className="flex flex-col items-center">
          <Star className="h-8 w-8 text-purple-500 mb-2" />
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Points</span>
            <Badge variant="secondary" className="text-lg font-bold">
              {waitlistData.points}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Users className="h-8 w-8 text-blue-500 mb-2" />
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Parrainages</span>
            <Badge variant="secondary" className="text-lg font-bold">
              {waitlistData.referral_count}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Skip the Line Section */}
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold">Vous voulez passer devant dans la file ? 🚀</h2>
        <p className="text-muted-foreground">Parrainez des amis et gagnez +10 points par ami</p>
        <p className="text-sm text-green-600 font-medium">🎁 Bonus +30 points quand ils rejoignent notre Discord !</p>
      </div>

      {/* Referral Buttons */}
      <div className="space-y-4">
        <h3 className="font-medium">Partager sur :</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={shareOnTwitter} variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button onClick={shareOnLinkedIn} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button onClick={shareOnWhatsApp} variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Plus <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={shareOnTelegram}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareOnFacebook}>
                <Share2 className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareByEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareOnReddit}>
                <Share2 className="h-4 w-4 mr-2" />
                Reddit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateQRCode}>
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Votre lien de parrainage :</label>
        <div className="flex gap-2">
          <Input 
            value={getReferralUrl()} 
            readOnly 
            className="text-sm"
          />
          <Button 
            onClick={copyReferralLink} 
            variant="outline" 
            size="sm"
            className={copied ? 'bg-green-100' : ''}
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copié !' : 'Copier'}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Discord Connection */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-5 w-5 text-purple-500" />
          <span className="font-medium">Connectez-vous avec nous</span>
        </div>
        <Button 
          onClick={handleDiscordJoin}
          variant="rainbow"
          size="lg"
          className="w-full md:w-auto"
        >
          Rejoindre Discord
        </Button>
        <p className="text-sm text-muted-foreground">
          Rejoignez notre communauté Discord pour des mises à jour exclusives !
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <Card className="w-full rounded-t-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="pb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            {content}
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {content}
      </CardContent>
    </Card>
  );
};

export default WaitlistConfirmation;
