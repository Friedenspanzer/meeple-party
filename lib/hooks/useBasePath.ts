export default function useBasePath() {
    return process.env.BASE_URL || window.location.origin;
}
