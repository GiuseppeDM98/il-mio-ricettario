import { v4 as uuidv4 } from 'uuid';
import { Ingredient, Step } from '@/types';

export interface ParsedRecipe {
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  notes?: string;
}

/**
 * Parse markdown text from Claude into structured recipe objects
 */
export function parseExtractedRecipes(markdownText: string): ParsedRecipe[] {
  const recipes: ParsedRecipe[] = [];

  // Split by recipe separator (---\n---\n)
  const recipeSections = markdownText.split(/---\s*---/).map(s => s.trim()).filter(Boolean);

  for (const recipeSection of recipeSections) {
    try {
      const recipe = parseRecipeSection(recipeSection);
      if (recipe) {
        recipes.push(recipe);
      }
    } catch (error) {
      console.error('Error parsing recipe section:', error);
      // Continue with next recipe
    }
  }

  return recipes;
}

/**
 * Parse a single recipe section
 */
function parseRecipeSection(section: string): ParsedRecipe | null {
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length === 0) return null;

  // Extract title (first # heading)
  const titleMatch = lines[0].match(/^#\s+(.+)$/);
  if (!titleMatch) return null;

  const title = titleMatch[1].trim();
  const ingredients: Ingredient[] = [];
  const steps: Step[] = [];
  let servings: number | undefined;
  let prepTime: number | undefined;
  let cookTime: number | undefined;
  let notes = '';

  let currentSection = '';
  let currentIngredientSection: string | null = null;
  let currentStepSection: string | null = null;
  let stepOrder = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Check for section headers
    if (line.startsWith('## Ingredienti')) {
      currentSection = 'ingredients';
      // Extract section name (e.g., "## Ingredienti per la pasta" -> "Per la pasta")
      const sectionMatch = line.match(/##\s+Ingredienti(?:\s+(per\s+.+))?$/i);
      currentIngredientSection = capitalizeSectionName(sectionMatch?.[1] || null);
      continue;
    }

    if (line.startsWith('## Procedimento')) {
      currentSection = 'steps';
      // Extract section name (e.g., "## Procedimento per la genovese" -> "Per la genovese")
      const sectionMatch = line.match(/##\s+Procedimento(?:\s+(per\s+.+))?$/i);
      currentStepSection = capitalizeSectionName(sectionMatch?.[1] || null);
      continue;
    }

    // Check for metadata
    if (line.startsWith('**Porzioni:**')) {
      const match = line.match(/\*\*Porzioni:\*\*\s*(\d+)/);
      if (match) servings = parseInt(match[1]);
      continue;
    }

    if (line.startsWith('**Tempo di preparazione:**')) {
      const match = line.match(/\*\*Tempo di preparazione:\*\*\s*(.+)/);
      if (match) {
        prepTime = parseTimeToMinutes(match[1]);
      }
      continue;
    }

    if (line.startsWith('**Tempo di cottura')) {
      const match = line.match(/\*\*Tempo di cottura[^:]*:\*\*\s*(.+)/);
      if (match) {
        cookTime = parseTimeToMinutes(match[1]);
      }
      continue;
    }

    if (line.startsWith('**Note aggiuntive:**')) {
      const notesText = line.replace(/\*\*Note aggiuntive:\*\*\s*/, '');
      if (notesText) notes += notesText + '\n';
      continue;
    }

    // Parse ingredients
    if (currentSection === 'ingredients') {
      // Skip separator lines
      if (line === '---') continue;

      // Parse ingredient line (format: "Name, quantity" or "Name quantity")
      // Common patterns: "Farina 500 g", "Sale q.b.", "Olio EVO"
      const ingredient = parseIngredientLine(line, currentIngredientSection);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    // Parse steps
    if (currentSection === 'steps') {
      // Skip separator lines
      if (line === '---') continue;

      // Parse step line (starts with - or a number)
      if (line.startsWith('-') || line.match(/^\d+\./)) {
        const description = line.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '').trim();
        if (description) {
          steps.push({
            id: uuidv4(),
            order: stepOrder++,
            description,
            section: currentStepSection || undefined,
          });
        }
      } else {
        // Continuation of previous step or note
        if (steps.length > 0 && !line.startsWith('**')) {
          steps[steps.length - 1].description += ' ' + line;
        } else if (line.startsWith('**') && line.includes('NOTA')) {
          notes += line + '\n';
        }
      }
    }

    // Collect notes
    if (line.startsWith('NOTA BENE:') || line.includes('Suggerimenti:')) {
      notes += line + '\n';
    }
  }

  return {
    title,
    ingredients,
    steps,
    servings,
    prepTime,
    cookTime,
    notes: notes.trim() || undefined,
  };
}

/**
 * Parse ingredient line into structured format
 */
function parseIngredientLine(line: string, section: string | null): Ingredient | null {
  // Remove leading bullets/dashes
  line = line.replace(/^[-•]\s*/, '').trim();

  if (!line || line.length < 2) return null;

  // Try to split by comma first
  let parts = line.split(',').map(p => p.trim());

  if (parts.length >= 2) {
    // Format: "Name, quantity"
    return {
      id: uuidv4(),
      name: parts[0],
      quantity: parts.slice(1).join(', '),
      section: section || undefined,
    };
  }

  // Try to extract quantity from end of string
  // Patterns: "500 g", "1 kg", "q.b.", "1 cucchiaio", "100-150 g"
  const quantityMatch = line.match(/^(.+?)\s+([\d\-]+\s*(?:g|kg|ml|l|cucchiai?|cucchiaini?|pezzi?|spicchi?|rametti?)(?:\s*circa)?|q\.?b\.?)$/i);

  if (quantityMatch) {
    return {
      id: uuidv4(),
      name: quantityMatch[1].trim(),
      quantity: quantityMatch[2].trim(),
      section: section || undefined,
    };
  }

  // No quantity found, treat whole line as name with empty quantity
  return {
    id: uuidv4(),
    name: line,
    quantity: '',
    section: section || undefined,
  };
}

/**
 * Convert time string to minutes
 */
function parseTimeToMinutes(timeStr: string): number {
  const normalized = timeStr.toLowerCase().trim();

  // Handle "X ora/ore"
  const hourMatch = normalized.match(/(\d+)\s*ora?/);
  if (hourMatch) {
    return parseInt(hourMatch[1]) * 60;
  }

  // Handle "X min/minuti"
  const minMatch = normalized.match(/(\d+)\s*min/);
  if (minMatch) {
    return parseInt(minMatch[1]);
  }

  // Handle combined "X ore Y min"
  const combinedMatch = normalized.match(/(\d+)\s*ora?.*?(\d+)\s*min/);
  if (combinedMatch) {
    return parseInt(combinedMatch[1]) * 60 + parseInt(combinedMatch[2]);
  }

  return 0;
}

/**
 * Capitalize first letter of section name if it starts with "per"
 * Examples:
 *   "per la genovese" → "Per la genovese"
 *   "Per la pasta" → "Per la pasta" (unchanged)
 *   "PER la genovese" → "Per la genovese" (normalized)
 *   "La pasta" → "La pasta" (unchanged, doesn't start with "per")
 */
function capitalizeSectionName(sectionName: string | null): string | null {
  if (!sectionName) return null;

  // If starts with "per " (any case), normalize to "Per " with capital P
  if (sectionName.toLowerCase().startsWith('per ')) {
    return 'Per' + sectionName.substring(3);
  }

  return sectionName;
}
