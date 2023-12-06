export interface ShareProfileProps {
  profileId: string;
}

export default function ShareProfile({ profileId }: ShareProfileProps) {
  return (
    <button type="button" className="btn btn-primary">
      Share
    </button>
  );
}
