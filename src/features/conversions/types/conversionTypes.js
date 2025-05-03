/**
 * @typedef {Object} ConversionEvent
 * @property {string} eventName
 * @property {string} date
 * @property {string} pageUrl
 * @property {string} trafficSource
 * @property {string|null} utm
 * @property {string|null} fbclid
 * @property {number} score
 * @property {string} sessionId
 */

/**
 * @typedef {Object} ConversionScore
 * @property {number} totalPoints
 * @property {number} totalVisits
 * @property {number} maxPossiblePoints
 * @property {string} scoreCalculation
 */

/**
 * @typedef {Object} ConversionDetails
 * @property {ConversionEvent[]} events
 * @property {ConversionScore} score
 */

/**
 * @typedef {Object} Conversion
 * @property {number} id
 * @property {string} conversionSequenceId
 * @property {number} adsInfluenceScore
 * @property {string} influenceCategory
 * @property {string|null} campaignName
 * @property {string} bookingId
 * @property {string} customerName
 * @property {string} serviceName
 * @property {number} amount
 * @property {string|null} teamMemberId
 * @property {string} createdAt
 * @property {ConversionDetails} details
 */

/**
 * @typedef {Object} ConversionsMeta
 * @property {number} page
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ConversionsStats
 * @property {number} totalConversions
 * @property {number} adInfluencedCount
 * @property {number} averageInfluenceScore
 * @property {number} totalRevenue
 */

/**
 * @typedef {Object} CampaignBreakdown
 * @property {string} campaignName
 * @property {number} count
 * @property {number} averageInfluenceScore
 * @property {number} revenue
 */

/**
 * @typedef {Object} InfluenceLevelBreakdown
 * @property {string} level
 * @property {number} count
 * @property {number} percentage
 * @property {number} revenue
 */

/**
 * @typedef {Object} ConversionsSummary
 * @property {number} totalConversions
 * @property {number} adInfluencedCount
 * @property {number} averageInfluenceScore
 * @property {number} totalRevenue
 * @property {CampaignBreakdown[]} campaignBreakdown
 * @property {InfluenceLevelBreakdown[]} influenceLevelBreakdown
 */

/**
 * @typedef {Object} ConversionsResponse
 * @property {Conversion[]} data
 * @property {ConversionsMeta} meta
 * @property {ConversionsStats} stats
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {Object} ConversionDetailResponse
 * @property {Conversion} data
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {Object} ConversionsSummaryResponse
 * @property {ConversionsSummary} data
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {Object} UseConversionsOptions
 * @property {number} [page]
 * @property {number} [size]
 * @property {string} [search]
 * @property {string} [influenceLevel]
 * @property {string} [startDate]
 * @property {string} [endDate]
 * @property {string} [teamMemberId]
 */

export {};
