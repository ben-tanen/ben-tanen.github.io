library(readxl)
library(data.table)

path <- getwd()

# import data
past_medals <- data.table(read_excel(paste0(path, "/events.xlsx"), sheet = "Past Winners"))
past_medals <- past_medals[order(-Year,Sport)]

# add medal points amount
past_medals[Medal == "Gold", "Medal_Flag"]   <- (3 * 4) / past_medals[Medal == "Gold", "Divider"]
past_medals[Medal == "Silver", "Medal_Flag"] <- (2 * 4) / past_medals[Medal == "Silver", "Divider"]
past_medals[Medal == "Bronze", "Medal_Flag"] <- (1 * 4) / past_medals[Medal == "Bronze", "Divider"]

# filter out countries not present past 1984
drop_countries <- past_medals[, max(Year), by=list(Country)][V1 < 1998,]$Country
past_medals_filtered <- past_medals[!Country %in% drop_countries, ]

# transform data
past_medal_grp <- past_medals_filtered[, sum(Medal_Flag), by=list(Country,Sport,Year,`Country Code`)]
past_medal_grp$Year <- paste0("y", past_medal_grp$Year)
past_medal_grp2 <- dcast(past_medal_grp, Country + `Country Code` + Sport ~ Year, value.var = "V1", fill = 0)

# get linear regression using previous games
model <- lm(formula = y2014 ~ y2010 + y2006 + y2002 + y1998 + y1992, data=past_medal_grp2)
summary(model)
model2 <- lm(formula = y2010 ~ y2006 + y2002 + y1998 + y1992 + y1988, data=past_medal_grp2)
summary(model2)
model3 <- lm(formula = y2006 ~ y2002 + y1998 + y1992 + y1988 + y1984, data=past_medal_grp2)
summary(model3)
predict <- function(past_perf) { 
  coeffs <- rowMeans(cbind(model$coefficients, model2$coefficients, model3$coefficients))
  sum(past_perf * coeffs[2:length(coeffs)]) + coeffs[1] 
} 

# testing it out
subset <- past_medal_grp2[,c("Country", "Country Code", "Sport", "y2014", "y2010", "y2006", "y2002", "y1998")]
predict(subset[Country == "CAN" & Sport == "Biathlon", -c("Country", "Country Code", "Sport")])

# get projected results for all teams
log <- c()
full_results <- data.table(Country = unique(past_medals$Country))
for (country in unique(past_medals$Country)) {
  for (sport in unique(past_medals$Sport)) {
    arr <- subset[Country == country & Sport == sport, -c("Country", "Country Code", "Sport")]
    if (dim(arr)[1] == 1) {
      full_results[Country == country, sport] <- predict(arr)
      log <- c(log, predict(arr))
    }
  }
}

# merge on country code
full_results <- unique(merge(full_results, subset[, c("Country", "Country Code")], by="Country", all.x = T))

# get total points and sort
full_results$total <- rowSums(full_results[,c(2:16)], na.rm = T)
full_results <- full_results[total > 0, ][order(-total)]
fr2 <- full_results[,c("Country", "Country Code", "Alpine Skiing", "Biathlon", "Bobsleigh", "Cross-Country Skiing", "Curling", 
                       "Figure Skating", "Freestyle Skiing", "Ice Hockey", "Luge", "Nordic Combined", "Skeleton", "Ski Jumping", 
                       "Snowboard", "Speed Skating", "Short Track Speed Skating", "total")]
write.csv(fr2, paste0(path, "/predictions.csv"))

# max(full_results[, -c("Country", "Country Code", "total")], na.rm = T)
sort(log)

# making a lookup table for summary stats
c_lookup <- data.table(read_excel(paste0(path, "/events.xlsx"), sheet = "Country Lookup"))

past_medals_grp3 <- past_medals_filtered[, .(G = sum(Medal == "Gold"), S = sum(Medal == "Silver"), B = sum(Medal =="Bronze")), 
                                         by=list(Country,Sport,Games)]

g_lookup <- merge(c_lookup, past_medals_grp3, by.x = "Code-3", by.y = "Country")
g_lookup$Games <- gsub(" {2,}", "", g_lookup$Games)
g_lookup$Year <- as.integer(substr(g_lookup$Games, nchar(g_lookup$Games) - 3, nchar(g_lookup$Games)))
g_lookup <- g_lookup[Year >= 1998, ][order(-Year)]

write.csv(g_lookup, paste0(path, "/g_lookup.csv"))


