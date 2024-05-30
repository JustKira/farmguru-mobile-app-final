interface UserData {
  accountId: string;
  loginId: string;
  accountType: string;
  email: string;
  name: string;
}

type Severity = 'late' | 'moderate' | 'early';

type Screens = 'INFO' | 'CROP' | 'IRRIGATION' | 'SCOUT';
