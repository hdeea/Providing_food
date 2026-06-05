export interface ChallengeStatusResponse {
  currentDay: number;
  completedDays: number;
  points: number;
  lastDonationDate: string | null;
  isWinner: boolean;
  progress: number;
  remainingDays: number;
  challengeName?: string;
  nextDonationDeadline?: string | null;
}

export interface ChallengeWinnerResponse {
  donorId: number;
  fullName: string;
  completedDays: number;
  points: number;
  isWinner: boolean;
  lastDonationDate: string | null;
}

export interface DonorPointsResponse {
  points: number;
  completedDays: number;
  lastDonationDate: string | null;
  isWinner: boolean;
  currentDay: number;
}

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseJson = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: text || response.statusText };
  }
};

const handleResponse = async (response: Response) => {
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || "فشل في الاتصال بالخادم");
  }
  return data;
};

export const createChallengePaymentSession = async (
  amount: number,
  regionName: string
): Promise<{ url: string; sessionId?: string }> => {
  const response = await fetch("/api/payment/create-challenge-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ amount, regionName }),
  });

  return handleResponse(response);
};

export const getChallengeStatus = async (): Promise<ChallengeStatusResponse> => {
  const response = await fetch("/api/challenge/status", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

export const getDonorPoints = async (): Promise<DonorPointsResponse> => {
  const response = await fetch("/api/donor/points", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

export const getChallengeWinners = async (): Promise<ChallengeWinnerResponse[]> => {
  const response = await fetch("/api/challenge/winners", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};

export const addDonorPoints = async (points: number) => {
  const response = await fetch("/api/donor/add-points", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ points }),
  });

  return handleResponse(response);
};

export const resetDonorPoints = async () => {
  const response = await fetch("/api/donor/reset-points", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};
