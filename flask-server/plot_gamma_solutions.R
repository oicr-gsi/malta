library(tidyverse)
library(jsonlite)
args = commandArgs(trailingOnly = TRUE)
# print(as.numeric(args[1]) + as.numeric(args[2]))
print(args[1])

df <- fromJSON("C:/Users/valamuri/Documents/malta/flask-server/test.json")

df <- df %>%
  select(gamma, cellularity, ploidy)

gamma.solutions <- df

df.cellularity<-data.frame(gamma=gamma.solutions$gamma,value=gamma.solutions$cellularity,type="cellularity")
df.ploidy<-data.frame(gamma=gamma.solutions$gamma,value=gamma.solutions$ploidy,type="ploidy")

df<-rbind(df.cellularity,df.ploidy)
df$type_f<-factor(df$type, levels = c('cellularity','ploidy')) # determines panel order

df<-data.frame(df, y_min=0)

p<-ggplot(df, aes(x=gamma, y=value))+
  geom_line(linetype = "dashed", aes(colour = type_f, group = type_f),size=1)+
  geom_point(aes(colour = type_f, group = type_f),size=4)+
  scale_x_continuous(breaks = as.numeric(gamma.solutions$gamma)) +
  facet_grid(rows = vars(type_f), scales="free")+
  theme_bw(base_size=18)+
  theme(legend.position = "none") +
  geom_blank(aes(y = y_min)) # trick to set y-axis scale origin at the zero value

p
# args = commandArgs(trailingOnly = TRUE)
# print(as.numeric(args[1]) + as.numeric(args[2]))

# x_axis_breaks <- append(50, seq(100, max(df$gamma), by=100))
# 
# c <- df %>% 
#   ggplot(aes(x=gamma, y=cellularity))+
#   geom_point(color="green", size=3)+
#   scale_x_continuous(breaks=x_axis_breaks)
# 
# p <- df %>% 
#   ggplot(aes(x=gamma, y=ploidy))+
#   geom_point(color="red", size=3)+
#   scale_x_continuous(breaks=x_axis_breaks)+
#   scale_y_continuous(breaks=seq(min(df$ploidy), max(df$ploidy), by=0.2))
# 
# g <- p + c
# 
# ggplot() +
#   geom_point(data=df, aes(x=gamma, y=cellularity), color="green", size=3)+
#   scale_x_continuous(breaks=x_axis_breaks)+
#   
#   geom_point(data=df, aes(x=gamma, y=ploidy), color="red", size=3)+
#   scale_x_continuous(breaks=x_axis_breaks)
