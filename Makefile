# Makefile pour nettoyer et minifier les fichiers CSS et JS
# Usage: make clean, make minify, make build

# Variables
CSS_DIR = public/assets/style
JS_DIR = public/assets/js
CSS_FILES = main.css gallery-carousel.css mentions-legales.css plan-du-site.css
JS_FILES = main.js gallery-carousel.js

# Outils de minification (via npm)
CLEANCSS = npx clean-css-cli
TERSER = npx terser

# Couleurs pour les messages
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

.PHONY: all clean minify-css minify-js minify build help check-deps

# Cible par défaut
all: build

# Aide
help:
	@echo "$(GREEN)Makefile pour Laser Game Gap$(NC)"
	@echo ""
	@echo "Cibles disponibles:"
	@echo "  $(YELLOW)make clean$(NC)      - Supprime tous les fichiers minifiés"
	@echo "  $(YELLOW)make minify-css$(NC) - Minifie tous les fichiers CSS"
	@echo "  $(YELLOW)make minify-js$(NC)   - Minifie tous les fichiers JS"
	@echo "  $(YELLOW)make minify$(NC)     - Minifie tous les fichiers CSS et JS"
	@echo "  $(YELLOW)make build$(NC)      - Nettoie puis minifie tout (recommandé)"
	@echo "  $(YELLOW)make check-deps$(NC) - Vérifie les dépendances npm"

# Vérifier les dépendances
check-deps:
	@echo "$(YELLOW)Vérification des dépendances...$(NC)"
	@command -v npx >/dev/null 2>&1 || { echo "$(YELLOW)Erreur: npx n'est pas installé. Installez Node.js et npm.$(NC)"; exit 1; }
	@echo "$(GREEN)✓ npx trouvé$(NC)"

# Nettoyer les fichiers minifiés
clean:
	@echo "$(YELLOW)Nettoyage des fichiers minifiés...$(NC)"
	@for css in $(CSS_FILES); do \
		if [ -f "$(CSS_DIR)/$${css%.*}.min.css" ]; then \
			rm "$(CSS_DIR)/$${css%.*}.min.css"; \
			echo "$(GREEN)✓ Supprimé: $(CSS_DIR)/$${css%.*}.min.css$(NC)"; \
		fi; \
	done
	@for js in $(JS_FILES); do \
		if [ -f "$(JS_DIR)/$${js%.*}.min.js" ]; then \
			rm "$(JS_DIR)/$${js%.*}.min.js"; \
			echo "$(GREEN)✓ Supprimé: $(JS_DIR)/$${js%.*}.min.js$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)Nettoyage terminé!$(NC)"

# Minifier les fichiers CSS
minify-css: check-deps
	@echo "$(YELLOW)Minification des fichiers CSS...$(NC)"
	@for css in $(CSS_FILES); do \
		if [ -f "$(CSS_DIR)/$$css" ]; then \
			echo "$(YELLOW)Minification de $$css...$(NC)"; \
			$(CLEANCSS) -o "$(CSS_DIR)/$${css%.*}.min.css" "$(CSS_DIR)/$$css" || { echo "$(YELLOW)Erreur lors de la minification de $$css$(NC)"; exit 1; }; \
			echo "$(GREEN)✓ Créé: $(CSS_DIR)/$${css%.*}.min.css$(NC)"; \
		else \
			echo "$(YELLOW)⚠ Fichier non trouvé: $(CSS_DIR)/$$css$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)Minification CSS terminée!$(NC)"

# Minifier les fichiers JS
minify-js: check-deps
	@echo "$(YELLOW)Minification des fichiers JS...$(NC)"
	@for js in $(JS_FILES); do \
		if [ -f "$(JS_DIR)/$$js" ]; then \
			echo "$(YELLOW)Minification de $$js...$(NC)"; \
			$(TERSER) "$(JS_DIR)/$$js" -o "$(JS_DIR)/$${js%.*}.min.js" --compress --mangle || { echo "$(YELLOW)Erreur lors de la minification de $$js$(NC)"; exit 1; }; \
			echo "$(GREEN)✓ Créé: $(JS_DIR)/$${js%.*}.min.js$(NC)"; \
		else \
			echo "$(YELLOW)⚠ Fichier non trouvé: $(JS_DIR)/$$js$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)Minification JS terminée!$(NC)"

# Minifier tous les fichiers
minify: minify-css minify-js
	@echo "$(GREEN)✓ Tous les fichiers ont été minifiés!$(NC)"

# Build complet: nettoyer puis minifier
build: clean minify
	@echo ""
	@echo "$(GREEN)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✓ Build terminé avec succès!$(NC)"
	@echo "$(GREEN)════════════════════════════════════════$(NC)"
	@echo ""
	@echo "Fichiers minifiés créés:"
	@for css in $(CSS_FILES); do \
		if [ -f "$(CSS_DIR)/$${css%.*}.min.css" ]; then \
			echo "  $(GREEN)✓$(NC) $(CSS_DIR)/$${css%.*}.min.css"; \
		fi; \
	done
	@for js in $(JS_FILES); do \
		if [ -f "$(JS_DIR)/$${js%.*}.min.js" ]; then \
			echo "  $(GREEN)✓$(NC) $(JS_DIR)/$${js%.*}.min.js"; \
		fi; \
	done

