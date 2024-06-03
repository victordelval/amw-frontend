# Methodology

## Overview

The mine detector is a statistical and computational model known as an artificial neural network, which we train to discriminate mines from another terrain by feeding it hand-labeled examples of mines and other key features as they appear in Sentinel-2 satellite imagery. This lightweight convolutional neural network ([click here to know more](https://en.wikipedia.org/wiki/Convolutional_neural_network)) operates on 44 x 44 pixel (440 meters x 440 meters) patches of data extracted from the [Sentinel 2 L1C data product](https://sentinel.esa.int/web/sentinel/missions/sentinel-2). Each pixel in the patch captures the light reflected from Earth's surface in 12 bands of visible and infrared light. We average (median composite) the Sentinel data across a four-month period to reduce the presence of clouds, cloud shadow, and other transitory effects.

During runtime, the network assesses each patch for signs of recent mining activity, and then the region of interest is shifted by 140 meters for the network to make a subsequent assessment. This process proceeds across the entire region of interest. The network makes 326 million individual assessments, which are needed to cover the 6.7 million square kilometers of the Amazon basin once every four months.

The system was developed for use in the Amazon, but it has also been seen to work in other tropical biomes.

## Detection Accuracy

Creating quantitative accuracy metrics for a system like this is not always easy or constructive. For example, if the system asserted that there are no mines at all in the Amazon basin, it would be better than 99% accurate, because such a large proportion of the landscape remains unmined.

To provide a more constructive measure, we validated a random subsample of the system's detections. This allows us to estimate what is known as the precision or positive predictive value for the classifier. In essence, it tells you the likelihood that box marked as a mine is actually a mine. On our latest run, we see a precision of 98.2%. For a sample of 500 mining detections, you can expect to see about 9 misclassifications. In our sample, a third of the false detections still identified mining activity, but mining for materials such as bauxite rather than gold.

## Area Estimation

The goal of this work is mine detection rather than area estimation, and our classification operates on 440 m x 440 m patches. If the network determines that mining exists within the patch, then the full patch is declared a mine. This leads to a systematic overestimation of mined area if it is naively computed from the polygon boundaries. Building a segmentation model to delineate mine boundaries would be a viable extension of this work.
