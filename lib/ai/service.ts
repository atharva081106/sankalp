/**
 * AI Intelligence Layer Stubs
 * These functions simulate calls to Anthropic/OpenAI APIs for the LaunchPad differentiators.
 */

export interface ExtractedRequirement {
  domain: string
  capabilities: string[]
  deployment: string
  scale: string
  constraints: string
}

export interface ReadinessScore {
  technicalFit: number
  deploymentReadiness: number
  security: number
  compliance: number
  pastDeployments: number
  scalability: number
  costEfficiency: number
  overall: number
}

export interface MatchExplanation {
  met: string[]
  gaps: string[]
}

/**
 * Extracts structured parameters from a raw unstructured problem statement.
 * @param rawProblem The raw text from the department user.
 */
export async function extractStructuredRequirement(rawProblem: string): Promise<ExtractedRequirement> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    domain: "Smart Infrastructure",
    capabilities: ["Computer Vision", "Edge Compute", "IoT"],
    deployment: "Retrofit / No trenching",
    scale: "City-wide",
    constraints: "Must comply with local data privacy laws (DPDP)."
  }
}

/**
 * Calculates a multidimensional readiness score for a proposal against a requirement.
 */
export async function calculateReadinessScore(proposalPitch: string, requirementJson: string): Promise<ReadinessScore> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    technicalFit: 88,
    deploymentReadiness: 75,
    security: 90,
    compliance: 100,
    pastDeployments: 60,
    scalability: 85,
    costEfficiency: 92,
    overall: 84
  }
}

/**
 * Generates an explainable match breakdown for why a startup was matched to a requirement.
 */
export async function generateMatchExplanation(proposalPitch: string, requirementJson: string): Promise<MatchExplanation> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    met: [
      "Startup has extensive Edge Compute capability",
      "Pricing model fits within the budget band"
    ],
    gaps: [
      "Has not yet deployed at a city-wide scale (previous max was 5 nodes)"
    ]
  }
}
