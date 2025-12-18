package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// Portfolio represents the complete portfolio data structure
type Portfolio struct {
	Personal       Personal           `json:"personal"`
	Social         []SocialLink       `json:"social"`
	Experience     []Experience       `json:"experience"`
	Education      []Education        `json:"education"`
	Skills         map[string][]Skill `json:"skills"`
	Projects       []Project          `json:"projects"`
	Certifications []Certification    `json:"certifications"`
}

// Personal information
type Personal struct {
	Name     string `json:"name"`
	Title    string `json:"title"`
	Tagline  string `json:"tagline"`
	Bio      string `json:"bio"`
	Photo    string `json:"photo"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Location string `json:"location"`
	Resume   string `json:"resume"`
}

// SocialLink represents a social media link
type SocialLink struct {
	Name string `json:"name"`
	Icon string `json:"icon"`
	URL  string `json:"url"`
}

// Experience represents work experience
type Experience struct {
	ID           int64    `json:"id"`
	Company      string   `json:"company"`
	Position     string   `json:"position"`
	Location     string   `json:"location"`
	StartDate    string   `json:"startDate"`
	EndDate      string   `json:"endDate"`
	Current      bool     `json:"current"`
	Description  string   `json:"description"`
	Highlights   []string `json:"highlights"`
	Technologies []string `json:"technologies"`
}

// Education represents educational background
type Education struct {
	ID          int64  `json:"id"`
	School      string `json:"school"`
	Degree      string `json:"degree"`
	Field       string `json:"field"`
	Location    string `json:"location"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	GPA         string `json:"gpa"`
	Description string `json:"description"`
}

// Skill represents a skill with proficiency level
type Skill struct {
	Name  string `json:"name"`
	Level int    `json:"level"`
}

// Project represents a portfolio project
type Project struct {
	ID           int64    `json:"id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	Image        string   `json:"image"`
	Technologies []string `json:"technologies"`
	GitHub       string   `json:"github"`
	Demo         string   `json:"demo"`
	Featured     bool     `json:"featured"`
	Highlights   []string `json:"highlights,omitempty"`
}

// Certification represents a professional certification
type Certification struct {
	Name   string `json:"name"`
	Issuer string `json:"issuer"`
	Date   string `json:"date"`
	URL    string `json:"url"`
}

const dataFile = "data/portfolio.json"

// CORS Middleware
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Allow all origins including chrome-extension
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Read portfolio data from JSON file
func readPortfolio() (*Portfolio, error) {
	file, err := os.ReadFile(dataFile)
	if err != nil {
		return nil, fmt.Errorf("error reading file: %v", err)
	}

	var portfolio Portfolio
	if err := json.Unmarshal(file, &portfolio); err != nil {
		return nil, fmt.Errorf("error parsing JSON: %v", err)
	}

	return &portfolio, nil
}

// Write portfolio data to JSON file
func writePortfolio(portfolio *Portfolio) error {
	// Write data directly without backup
	data, err := json.MarshalIndent(portfolio, "", "  ")
	if err != nil {
		return fmt.Errorf("error marshaling JSON: %v", err)
	}

	if err := os.WriteFile(dataFile, data, 0644); err != nil {
		return fmt.Errorf("error writing file: %v", err)
	}

	return nil
}

// Handler: Get complete portfolio
func getPortfolio(w http.ResponseWriter, r *http.Request) {
	portfolio, err := readPortfolio()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(portfolio)
}

// Handler: Update complete portfolio
func updatePortfolio(w http.ResponseWriter, r *http.Request) {
	var portfolio Portfolio

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	log.Printf("Received portfolio update request, body length: %d bytes", len(body))

	if err := json.Unmarshal(body, &portfolio); err != nil {
		log.Printf("Error parsing JSON: %v", err)
		log.Printf("Request body: %s", string(body))
		http.Error(w, fmt.Sprintf("Invalid JSON format: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("Successfully parsed portfolio data")

	if err := writePortfolio(&portfolio); err != nil {
		log.Printf("Error writing portfolio: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Printf("Portfolio updated successfully")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Portfolio updated successfully",
	})
}

// Handler: Update personal info
func updatePersonal(w http.ResponseWriter, r *http.Request) {
	portfolio, err := readPortfolio()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var personal Personal
	if err := json.NewDecoder(r.Body).Decode(&personal); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	portfolio.Personal = personal

	if err := writePortfolio(portfolio); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Personal info updated successfully",
	})
}

// Handler: Add experience
func addExperience(w http.ResponseWriter, r *http.Request) {
	portfolio, err := readPortfolio()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var exp Experience
	if err := json.NewDecoder(r.Body).Decode(&exp); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	if exp.ID == 0 {
		exp.ID = time.Now().UnixNano()
	}

	portfolio.Experience = append(portfolio.Experience, exp)

	if err := writePortfolio(portfolio); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(exp)
}

// Handler: Update experience
func updateExperience(w http.ResponseWriter, r *http.Request) {
	portfolio, err := readPortfolio()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var exp Experience
	if err := json.NewDecoder(r.Body).Decode(&exp); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	for i, e := range portfolio.Experience {
		if e.ID == exp.ID {
			portfolio.Experience[i] = exp
			break
		}
	}

	if err := writePortfolio(portfolio); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Experience updated successfully",
	})
}

// Handler: Delete experience
func deleteExperience(w http.ResponseWriter, r *http.Request) {
	portfolio, err := readPortfolio()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req struct {
		ID int64 `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	newExp := []Experience{}
	for _, e := range portfolio.Experience {
		if e.ID != req.ID {
			newExp = append(newExp, e)
		}
	}
	portfolio.Experience = newExp

	if err := writePortfolio(portfolio); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Experience deleted successfully",
	})
}

// Health check endpoint
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

func main() {
	// Ensure data directory exists
	if err := os.MkdirAll(filepath.Dir(dataFile), 0755); err != nil {
		log.Fatal("Error creating data directory:", err)
	}

	// Routes
	http.HandleFunc("/health", enableCORS(healthCheck))
	http.HandleFunc("/api/portfolio", enableCORS(getPortfolio))
	http.HandleFunc("/api/portfolio/update", enableCORS(updatePortfolio))
	http.HandleFunc("/api/personal", enableCORS(updatePersonal))
	http.HandleFunc("/api/experience/add", enableCORS(addExperience))
	http.HandleFunc("/api/experience/update", enableCORS(updateExperience))
	http.HandleFunc("/api/experience/delete", enableCORS(deleteExperience))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📁 Data file: %s", dataFile)
	log.Printf("🌐 CORS enabled for all origins")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
