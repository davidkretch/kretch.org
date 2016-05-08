---
layout: post
title: Multilevel models
---

In this post, I want to give a brief introduction to multilevel models, which 
help when you're trying to figure out questions like what the average income 
in each ZIP code is; that is, very specific questions that might be difficult to 
answer well with even large amounts of data, because they pertain to very narrow 
slices of that data. A multilevel model can make better use of the data you 
already have by adding the structure of your data, e.g. ZIP codes in counties, 
into your model.

The way a multilevel model encodes structure is by taking the parameters that 
you're estimating, and adding another model which 'explains' those parameters. 
If you try to estimate average income per ZIP code, you need to estimate however
many parameters as there are ZIP codes; in a multilevel model, there will be 
another model on top of that which says these ZIP codes are in the same county 
and are the product of the same underlying pattern. By encoding this structure 
into the model, it allows the model to share information among related groups, 
and groups that don't have much data can borrow strength from those that do.

## Forecasting elections

A neat example of the use of multilevel models appears in the paper
[Forecasting elections with non-representative 
polls](http://www.stat.columbia.edu/~gelman/research/published/forecasting-with-nonrepresentative-polls.pdf), 
whose authors forecast the 2012 US presidential election with Xbox online poll 
data. Generally when pollsters forecast elections, they try to put together a 
representative sample of voters and ask them who they will vote for. The 
authors on the other hand took an extremely non-representative sample of people 
who answered polls on the Xbox online service, then used a multilevel model to 
estimate how different demographic groups would vote.

The Xbox poll data had a huge number of respondents, however they were very 
different in composition from voters: 93% were men, and 65% were between 18 and 
29. This means the simple approach, taking an average and making that your 
forecast, would be a bad idea. Taking averages by demographic group would
be better, but in this data, many demographic groups don't appear very 
often, and your resulting group-level averages might not be that good. 

The authors resolve this using a multilevel model which estimates shares of the 
vote for different demographic groups, but where these estimates rely on 
information shared among related groups -- e.g. the estimate for 65+ women 
relies on data from women and from people 65 or older. And they're quite 
successful; compared against exit polls, their estimate for 65+ women was off by
only 1% point. And after translating these estimates into election forecasts, 
they meet or exceed the forecast performance of poll aggregator Pollster.com.

## A made-up example

In the following made-up example, I want to give you an idea of what is going on
when you use a multilevel model. Suppose we're interested in some topic in 
Washington DC, Maryland, and Virginia, we want to know what the typical or mean 
values are, and we've collected some data, shown below. We have a lot of data 
from Maryland and Virginia but sadly only one data point from DC. Also shown are
the 'true' means, which I know in this case because I generated the data.

![Data and true means]({{ site.baseurl }}public/images/multilevel_models_1.svg)

Given only the data, we want to figure out the state-level means. To begin with,
let's just directly calculate the sample means state-by-state, even though this 
might not ultimately be a very good idea. To make it look like science, this is 
basically the same as estimating a linear model of our data, which we'll call 
\\( y \\), as a function of state, \\( x \\), to get estimates of our means, 
parameters \\( \beta \\):

$$
y = \beta_{state} x_{state} + \epsilon
$$

When we actually estimate this, we use 0/1 dummy variables for each state, and 
correspondingly have three \\( \beta_{state} \\): 

$$
y = \beta_{dc} x_{dc} + \beta_{md} x_{md} + \beta_{va} x_{va} + \epsilon
$$

We fit this model in R with `lm(y ~ state - 1, data = df)`[^1]:

[^1]: We remove the intercept by adding `- 1` to the model formula so that our 
      parameter estimates are for each state in themselves, and not compared to 
      some reference state. 

![Sample mean results]({{ site.baseurl }}public/images/multilevel_models_2.svg)

Ok, so that worked for Maryland and Virginia -- their estimates are close to the
true values. But it did not work so well for DC, unsurprisingly. With only one 
data point, the estimate for DC couldn't have been anything else. 

We're pretty sure DC is similar to Maryland and Virginia in many respects. It 
seems like we should be averaging our DC data with the data from neighboring 
states somehow, at least as long as we don't have that much data for DC.

Let's incorporate that intuition into our model. We can do this by treating our 
state-level means as data, in a sense, and giving them their own model, in 
which they share a common region-level mean. But unlike data, which is fixed, 
we can adjust our state-level means to be close to our region-level mean. 

This is our multilevel model: one model for data \\( y \\), which depends on 
state-level means \\( \beta_{state} \\), and one model for 
\\( \beta_{state} \\), which depends on region-level mean \\( \alpha \\).

$$
\begin{align}
  y =& \ \beta_{state} x_{state} + \epsilon
  \\
  \beta_{state} =& \ \alpha + \eta
\end{align}
$$

When we fit this multilevel model, we try to make our estimates of 
\\( \beta_{state} \\) close to the \\( y \\) for their state, and at the same 
time we try to make all the \\( \beta_{state} \\) close to region-level mean 
\\( \alpha \\).

We fit this new model in R using `lmer(y ~ (1 | state), data = df)`[^2]:

[^2]: `lmer` is the linear mixed-effects model function from package lme4. The 
      model formula element `(1 | state)` tells `lmer` to add a model for 
      state-level intercepts, which we're calling \\( \beta_{state} \\).

![Multilevel model results]({{ site.baseurl }}public/images/multilevel_models_3.svg)

Much better. The multilevel model has pulled the DC estimate towards the 
region-level mean, and it is now actually quite close to the true value. What's 
happening is all of the data contributes to the model's estimate of the 
region-level mean, which in turn influences the DC estimate.

## What next

[Data Analysis Using Regression and Multilevel/Hierarchical 
Models](http://www.amazon.com/Analysis-Regression-Multilevel-Hierarchical-Models/dp/052168689X) 
by Gelman and Hill is the best introduction to multilevel models that I have 
seen. Chapters 11 and 12 in particular have a very good explanation of what they
are, how they work, why and when you'd use them, and have some nice motivating 
examples.

[lme4](https://cran.r-project.org/web/packages/lme4/index.html) is the 
standard package for estimating multilevel models in R. The Gelman/Hill book and 
the election forecasting paper above both use it. Most other statistical 
software packages also support multilevel models, generally under the name 
mixed-effects models.