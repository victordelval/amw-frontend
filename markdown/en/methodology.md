# Methodology

## Overview

The mine detector is an artificial neural network, which we train to discriminate mines from other terrain by feeding it hand-labeled examples of mines and other key features as they appear in Sentinel-2 satellite imagery. The network operates on square patches of data extracted from the Sentinel-2 L1C data product. Each pixel in the patch captures the light reflected from Earth's surface in twelve bands of visible and infrared light. We average (median composite) the Sentinel data across a period of many months to reduce the presence of clouds, cloud shadow, and other transitory effects.

During run time, the network assesses each patch for signs of recent mining activity, and then the region of interest is shifted by half a patch width for the network to make a subsequent assessment. This process proceeds across the entire region of interest. The network makes over 100 million individual assessments in covering the 6.7 million square kilometers of the Amazon basin.

The system was developed for use in the Amazon, but it has also been seen to work in other tropical biomes.

## Detection Accuracy

Creating quantitative accuracy metrics for a system like this is not always easy or constructive. For example, if the system asserted that there are no mines at all in the Amazon basin, it would be better than 99% accurate, because such a large proportion of the landscape is not mined.

To provide one indicative measure, we validated a random sample of 500 detections from 2023. This allows us to estimate what is known as the precision or positive predictive value for the classifier. In essence, it tells you the likelihood that a patch marked as a mine is actually a mine. Of the 500 samples, 498 have artisanal mining scars. One is an industrial mine, and one is a remnant of the construction of the Balbina dam and power station from around 1985. The estimated precision of the classifier in this real-world context is 99.6%.

## Area Estimation

The goal of this work is mine detection rather than area estimation, and our classification operates on square image patches covering around twenty hectares each. If the network determines that mining exists within the patch, then the full patch is declared a mine. This leads to a systematic overestimation of mined area if it is naively computed from the polygon boundaries. Building a segmentation model to delineate mine boundaries could be a useful extension of this work.
