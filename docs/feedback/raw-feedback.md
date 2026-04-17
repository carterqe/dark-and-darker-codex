Dark and Darker Codex - A new site for DaD players!
emoji:Disscussion: Discussion
r/DarkAndDarker - Dark and Darker Codex - A new site for DaD players!
Hey all! I've been working on a place where adventurers can share and discover builds, track the Market, explore interactive dungeon maps, and more. It's early days, and I know there's a lot of room to grow — that's exactly why I am reaching out.

I'd love for you to check it out, try it out, and tell me what you think. What's missing? What would make your dungeon runs easier? Every piece of feedback helps shape where this goes next.

https://darkanddarkercodex.com/

I am a solo developer, so I will do my best to hear the community and implement some suggested changes/feedback! Thank you :)


Upvote
38

Downvote

21
Go to comments


Share

Promote Post
4.3K views
See More Insights
Join the conversation
Sort by:

Best

Search Comments
Expand comment search
Comments Section

AutoModerator
MOD
•
2h ago
•
Myels_Magus
•
2h ago
Oh wow! This is really great! Makes me wish we had an active wiki team again. But this is going to be a great tool. Thank you!



Upvote
12

Downvote

Reply

Award

Share

boofy920
OP
•
2h ago
Thank you very much for the comment. I really appreciate the kind words


Upvote
5

Downvote

Reply

Award

Share

497

OnlyOnOkasion
•
1h ago
What happened to the wiki team. Those docs fuckin suck.



Upvote
1

Downvote

Reply

Award

Share

Myels_Magus
•
50m ago
Most of the people contributing to it quit DaD. Fair enough but it's a bummer.



Upvote
1

Downvote

Reply

Award

Share

OnlyOnOkasion
•
49m ago
Something happen? I've been away from D&D for a while and just got back a couple weeks ago.



Upvote
1

Downvote

Reply

Award

Share

Myels_Magus
•
41m ago
I think they quit during the time of sdf's repetitive dev cycle of nerfing and un-nerfing the same things over and over again without touching any of the things people were actually being vocal about.

I can't pinpoint when the exact tipping point was, but there was a certain patch or two where everyone was really feeling doomer vibes about the game.

Things have bounced back a little bit in terms of the communities attitude towards the development future due to Paul taking lead on development and seemingly making changes the community has been asking for for some time soon after. Example, making it so you actually have to open red doors so they can't be camped.



Upvote
1

Downvote

Reply

Award

Share

OnlyOnOkasion
•
25m ago
Appreciate the thorough response man.


Upvote
1

Downvote

Reply

Award

Share

Myels_Magus
•
2h ago
Comment Image
Seemed to get stuck loading some things in the market page.



Upvote
2

Downvote

Reply

Award

Share

boofy920
OP
•
2h ago
Any chance you can check out the site again? I did a minor hotfix to improve some areas and loading speeds!



Upvote
3

Downvote

Reply

Award

Share

168

Myels_Magus
•
2h ago
I see it's loading now but not showing anything even though in the all listing you can clearly see some boots are listed. I assume it's because the gear slot drop down menu doesn't have the items flagged quite right for everything? I'm not really sure what goes into dev for this, just assuming.

Comment Image


Upvote
2

Downvote

Reply

Award

Share

boofy920
OP
•
2h ago
Fixed the market! Good find. When you picked "Boots" from the dropdown, the code was sending archetype=Boots to the database as a server-side filter. But the databases archetype field holds the full item name — things like "Padded Leather Boots" or "Rogue Boots". It doesn't have an item called exactly "Boots", so it returned zero results.



Upvote
2

Downvote

Reply

Award

Share

76

Myels_Magus
•
1h ago
Yeah I'm checking the market and it's still really having a hard time with all the drop down menu filters. Might have to go through all of them and fix it up.


Upvote
3

Downvote

Reply

Award

Share

boofy920
OP
•
2h ago
This is really good to know! I will be sure to fix this and get it pushed out ASAP so the site can function better. Thanks for the feedback!


Upvote
1

Downvote

Reply

Award

Share

227

BronzeEagle88
•
41m ago
Profile Badge for the Achievement Top 1% Commenter Top 1% Commenter
One thing I have always wanted is a damage per hit and dps calculator

So you make your build and then you can see the damage and the breakdown for it. The wiki has all the damage formulas you need

Also be able to apply an sudo enemy so you can test your damage on like 40% pdr enemies

But good work keep working on it man take your time so you dont get burned out


Upvote
2

Downvote

Reply

Award

Share

Jeicam_
•
1h ago
•
Edited 1h ago
emoji:GoldRanger: Ranger
Monster drop pools, especially for quest

You can include boss stats and summary

I feel like instead of putting whole maps, listing all possible modules could be better, especially if they flip flop again into random maps. + Player Spawn Spots.

I think you might enjoy looking at tarkov.dev for 'inspiration'


Upvote
1

Downvote

Reply

Award

Share

scaremenow
•
51m ago
emoji:GoldCleric: Cleric
It would be great if the quest items in Traders/Quest Items would tell you which mob drops it, like if you clicked on Broken Skull, it would tell you "Skeleton, Any map". This could also be a button to "show on map" and it would show all the locations of the skeletons (or when searching for Bellows, highlights the Wraits in their modules, etc.)

Is the information on the page Datamined? I would rather it be user-submitted, through experience.

I don't see a real need/use for the "Realms"'s information about the market (what's put for sale, what's bought) especially since we can't preview the stats on equipment.

The search bar in the market should have an auto-fill.

I don't see the use of marking the gear score (or the Armory) of items at the moment, but it could be useful in the future.

The map is probably the tool I'd use the most, but there are icons for Campfire? Shrines are not well placed. Lava golem in the Goblin caves rather than Firedeep, and bosses are not in their correct modules. Some modules do not match the current visual (ex. Graveyard, Keep, Stables) and the default layout for Ruins.


Upvote
1

Downvote

Reply

Award

Share

misa222
•
47m ago
Haven’t had a chance to look at it yet but this looks so promising. Thank you so much! I will check it out after work!


Upvote
1

Downvote

Reply

Award

Share

Total-Brick-1136
•
34m ago
Absolutely killer stuff my guy, really clean website and I can see the potential. My friends and I have wanted a live market reference like you see for OSRS and such and I can see this fitting that niche.

I think for me personally the main focus should be around accuracy with reference info such as the interactive maps as they seem slightly outdated, possibly even enquiring around a submission area to add in updated info on the website (as the devs flip between active and inactive changes quite a bit). But for me personally if the accuracy of the site is treated as the priority and the flair comes second, you'll see a lot more interaction with the site.

I really hope this grows for you and becomes the DaD reference for the game, hold that line champion.


Upvote
1

Downvote

Reply

Award

Share

theflossboss1
•
2h ago
emoji:GoldCleric: Celric Gang
Profile Badge for the Achievement Top 1% Commenter Top 1% Commenter
This shit is so buggy



Upvote
-2

Downvote

Reply

Award

Share

boofy920
OP
•
2h ago
Yeah... sorry about that haha. I'm noticing that loading is getting hung up on certain areas. You guys are the first viewers other than me! So its good to get a idea on what traffic flow looks like. Thank you for the feedback!


Upvote
3

Downvote

Reply

Award

Share

173

