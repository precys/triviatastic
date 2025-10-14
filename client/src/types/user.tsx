export interface User {
    username: string,
    userId: string,
    game_count: number,
    streak: number,
    category_counts: { [category: string]: number }; 
    category_scores: { [category: string]: number }; 
    hi_score: number,
    easy_count: number,
    med_count: number,
    hard_count: number,
}