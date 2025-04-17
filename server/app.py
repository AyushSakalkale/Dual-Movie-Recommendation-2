from flask import Flask, request, jsonify
from flask_cors import CORS
from rapidfuzz import process
import pandas as pd
import pickle
import requests


app = Flask(__name__)
CORS(app)

# Load the processed data and similarity matrix
with open('movie_data.pkl', 'rb') as file:
    movies, cosine_sim = pickle.load(file)

def fetch_movie_details(movie_id):
    api_key = '041afab09a0c3f7eef21c8fc4a9ce1a3'  # Replace with your TMDB API key
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}'
    try:
        # Disable SSL verification to avoid SSL issues in Docker
        response = requests.get(url, verify=False)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching movie details: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception when fetching movie details: {str(e)}")
        # Return a fallback response with basic information
        return {
            'title': f'Movie {movie_id}',
            'poster_path': None,
            'release_date': 'Unknown',
            'overview': 'No overview available',
            'vote_average': 'N/A'
        }

def get_recommendations(title, cosine_sim=cosine_sim, threshold=70):
    """
    Get movie recommendations based on the input title using cosine similarity.

    Args:
        title (str): The title of the movie to find recommendations for.
        cosine_sim (ndarray): Precomputed cosine similarity matrix.
        threshold (int): Fuzzy matching confidence threshold (0-100).

    Returns:
        list[dict]: List of recommended movies with details.
    """
    try:
        # Perform fuzzy matching to find the closest title
        closest_match = process.extractOne(title, movies['title'].values)
        if not closest_match or closest_match[1] < threshold:
            return {"error": f"No matching movie found for '{title}'."}

        matched_title = closest_match[0]
        idx = movies[movies['title'] == matched_title].index[0]

        # Get similarity scores for the matched movie
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]  # Top 10 similar movies
        movie_indices = [i[0] for i in sim_scores]

        # Fetch detailed information for each recommended movie
        recommendations = []
        for i in movie_indices:
            movie = movies.iloc[i]
            movie_details = fetch_movie_details(movie['movie_id'])

            if movie_details:
                recommendations.append({
                    'Title': movie_details.get('title', movie['title']),
                    'Poster': f"https://image.tmdb.org/t/p/w500{movie_details['poster_path']}" if movie_details.get('poster_path') else None,
                    'Year': movie_details.get('release_date', '').split('-')[0] if movie_details.get('release_date') else 'Unknown',
                    'Overview': movie_details.get('overview', 'No overview available'),
                    'Rating': movie_details.get('vote_average', 'N/A'),
                    'imdbID': str(movie['movie_id'])
                })
            else:
                # Fallback to local data if API call fails
                recommendations.append({
                    'Title': movie['title'],
                    'Poster': None,
                    'Year': 'Unknown',
                    'Overview': 'No overview available',
                    'Rating': 'N/A',
                    'imdbID': str(movie['movie_id'])
                })

        # Return recommendations
        return recommendations if recommendations else {"error": "No recommendations found."}
    
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    title = data.get('title')
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    recommendations = get_recommendations(title)
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
