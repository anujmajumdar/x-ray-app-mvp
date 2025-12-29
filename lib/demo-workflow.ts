import { XRayClient } from "./xray-sdk";
import { ProductCategory, TestCase } from "./demo-test-cases";

export async function runCompetitorSelection(
  prospect: TestCase,
  categoryConfig?: ProductCategory
) {
  const workflowName = categoryConfig 
    ? `${categoryConfig.name} - Competitor Analysis`
    : "Amazon Competitor Selection";
  
  const xray = new XRayClient(workflowName, prospect);

  try {
    // STEP 1: LLM Keyword Generation
    const keywords = await xray.step(
      { name: "Generate Search Keywords", type: "llm", input: prospect.title },
      async (log) => {
        // Check if this test case should fail at step 1
        if (prospect.failureStep === 1) {
          log.logReasoning(`Attempted to generate keywords but encountered error: ${prospect.failureReason || 'LLM service unavailable'}`);
          throw new Error(prospect.failureReason || 'LLM service unavailable');
        }
        
        const generatedKeywords = categoryConfig 
          ? categoryConfig.keywords(prospect)
          : ["stainless steel water bottle 32oz", "vacuum insulated flask"];
        
        log.logReasoning("Extracted core product attributes while stripping brand name and promotional phrases.");
        return generatedKeywords;
      }
    );

    // STEP 2: Mock API Search
    const candidates = await xray.step(
      { name: "Retrieve Candidates", type: "api", input: { keywords } },
      async (log) => {
        // Check if this test case should fail at step 2
        if (prospect.failureStep === 2) {
          log.logReasoning(`Attempted to retrieve candidates but encountered error: ${prospect.failureReason || 'API service unavailable'}`);
          throw new Error(prospect.failureReason || 'API service unavailable');
        }
        
        const mockDb = categoryConfig
          ? categoryConfig.mockCandidates(prospect)
          : [
              { id: 'C1', title: "HydroFlask 32oz Wide Mouth", price: 44.95, rating: 4.8, reviews: 15200 },
              { id: 'C2', title: "Generic Plastic Bottle", price: 8.99, rating: 3.5, reviews: 12 },
              { id: 'C3', title: "Yeti Rambler 30oz", price: 38.00, rating: 4.7, reviews: 9400 },
              { id: 'C4', title: "Bottle Brush Cleaner", price: 12.00, rating: 4.5, reviews: 500 },
            ];
        log.logReasoning(`Search returned ${mockDb.length} items from the indexed catalog.`);
        return mockDb;
      }
    );

    // STEP 3: Apply Business Filters
    const filtered = await xray.step(
      { name: "Apply Business Filters", type: "filter", input: { count: candidates.length } },
      async (log) => {
        // Check if this test case should fail at step 3
        if (prospect.failureStep === 3) {
          log.logReasoning(`Attempted to apply filters but encountered error: ${prospect.failureReason || 'Filter service unavailable'}`);
          throw new Error(prospect.failureReason || 'Filter service unavailable');
        }
        
        // Adjust price threshold based on product category
        const priceThreshold = prospect.price >= 1000 ? 0.4 : 0.5; // Lower threshold for expensive items
        
        const filteredCandidates = candidates.filter(c => {
          const isRightPrice = c.price >= prospect.price * priceThreshold && c.price <= prospect.price * 1.5;
          const isHighRating = c.rating >= 4.0;
          const isPopular = c.reviews > 100;

          const passed = isRightPrice && isHighRating && isPopular;

          log.logEval({
            id: c.id,
            label: c.title,
            passed,
            reason: !isRightPrice ? 
              (c.price < prospect.price * priceThreshold 
                ? "Price point too low to be a direct competitor" 
                : "Price point too high to be a direct competitor") : 
              !isHighRating ? "Rating below quality threshold" :
              !isPopular ? "Insufficient market data (reviews < 100)" : "Strong competitor match"
          });

          return passed;
        });

        log.logReasoning(`Narrowed ${candidates.length} candidates down to ${filteredCandidates.length} based on price range (${prospect.price * priceThreshold}-${prospect.price * 1.5}), rating threshold (≥4.0), and review count (≥100).`);
        
        if (filteredCandidates.length === 0) {
          throw new Error('No candidates passed the business filters');
        }
        
        return filteredCandidates;
      }
    );

    // STEP 4: LLM Evaluation to Eliminate False Positives
    const evaluated = await xray.step(
      { name: "LLM Relevance Evaluation", type: "llm", input: { prospect: prospect.title, candidates: filtered.map((c: any) => c.title) } },
      async (log) => {
        // Check if this test case should fail at step 4
        if (prospect.failureStep === 4) {
          log.logReasoning(`Attempted to evaluate relevance but encountered error: ${prospect.failureReason || 'LLM evaluation service unavailable'}`);
          throw new Error(prospect.failureReason || 'LLM evaluation service unavailable');
        }
        
        // Simulate LLM evaluation - eliminate false positives based on semantic similarity
        const evaluatedCandidates = filtered.map((candidate: any) => {
          // Simulate LLM reasoning for each candidate
          const isRelevant = Math.random() > 0.2; // 80% chance of being relevant (simulating LLM evaluation)
          const relevanceScore = isRelevant ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3; // Score between 0.7-1.0 if relevant, 0-0.3 if not
          
          const reason = isRelevant 
            ? `Product matches core attributes and use case. Semantic similarity score: ${relevanceScore.toFixed(2)}`
            : `Product is a false positive - different use case or category mismatch. Relevance score: ${relevanceScore.toFixed(2)}`;
          
          log.logEval({
            id: candidate.id,
            label: candidate.title,
            passed: isRelevant,
            reason: reason
          });
          
          return { ...candidate, relevanceScore, isRelevant };
        });
        
        const relevantCandidates = evaluatedCandidates.filter((c: any) => c.isRelevant);
        
        log.logReasoning(`LLM evaluation eliminated ${evaluatedCandidates.length - relevantCandidates.length} false positives. ${relevantCandidates.length} candidates remain with high semantic relevance.`);
        
        if (relevantCandidates.length === 0) {
          throw new Error('All candidates eliminated as false positives by LLM evaluation');
        }
        
        return relevantCandidates;
      }
    );

    // STEP 5: Rank and Select Best Competitor
    const winner = await xray.step(
      { name: "Rank and Select Best Competitor", type: "ranking", input: { count: evaluated.length } },
      async (log) => {
        // Check if this test case should fail at step 5
        if (prospect.failureStep === 5) {
          log.logReasoning(`Attempted to rank candidates but encountered error: ${prospect.failureReason || 'Ranking service unavailable'}`);
          throw new Error(prospect.failureReason || 'Ranking service unavailable');
        }
        
        // Rank candidates by composite score: relevance (40%), reviews (30%), rating (20%), price match (10%)
        const ranked = evaluated.map((candidate: any) => {
          const relevanceWeight = candidate.relevanceScore * 0.4;
          const reviewsWeight = Math.min(candidate.reviews / 20000, 1) * 0.3; // Normalize to max 20k reviews
          const ratingWeight = (candidate.rating / 5) * 0.2;
          const priceMatchWeight = (1 - Math.abs(candidate.price - prospect.price) / prospect.price) * 0.1;
          
          const compositeScore = relevanceWeight + reviewsWeight + ratingWeight + priceMatchWeight;
          
          return {
            ...candidate,
            compositeScore,
            rankingFactors: {
              relevance: relevanceWeight.toFixed(3),
              reviews: reviewsWeight.toFixed(3),
              rating: ratingWeight.toFixed(3),
              priceMatch: priceMatchWeight.toFixed(3)
            }
          };
        }).sort((a: any, b: any) => b.compositeScore - a.compositeScore);
        
        // Log ranking for top candidates
        ranked.slice(0, 3).forEach((candidate: any, index: number) => {
          log.logEval({
            id: candidate.id,
            label: `${index + 1}. ${candidate.title}`,
            passed: index === 0,
            reason: `Composite score: ${candidate.compositeScore.toFixed(3)} (relevance: ${candidate.rankingFactors.relevance}, reviews: ${candidate.rankingFactors.reviews}, rating: ${candidate.rankingFactors.rating}, price: ${candidate.rankingFactors.priceMatch})`
          });
        });
        
        const bestCompetitor = ranked[0];
        log.logReasoning(`Selected "${bestCompetitor.title}" as the best competitor with composite score of ${bestCompetitor.compositeScore.toFixed(3)}.`);
        
        return bestCompetitor;
      }
    );
  } catch (error: any) {
    // Error is already captured in the step by the SDK's step() method
    // We continue to submit the trace so the failure is recorded
  }

  // Always submit the trace, even if there was an error
  // The SDK will mark it as 'failed' if any step has an error
  return await xray.submit();
}