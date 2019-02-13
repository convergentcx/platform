import React from 'react';
import styled from 'styled-components';

import { colors } from '../../common';
import { Terms } from './Terms';

const FAQContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  background: ${colors.BgGrey};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FAQItem = styled.div`
  color: #000;
  max-width: 80%;
  margin-bottom: 80px;
`;

const TermsButton = styled.span`
  cursor: pointer;
  transition: 0.2s;
  :hover {
    color: rgba(0,0,0,0.5);
  }
`;
class FAQPage extends React.Component {
  state = {
    showTerms: false,
  }

  render() {
    return (
      <FAQContainer>
        <FAQItem>
          <h1>What is a token?</h1>
          <p>
            A token is a rare digital asset that you can own and transfer without anyone’s permission or interference. You can think of it like a rare metal coin in your pocket - except that you do not have to carry it around because it only exists in the form of bits and bytes. This makes it easy to send to anyone in the world just by using the public internet - without a bank or financial institution in the middle.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>Why should I launch a personal token?</h1>
          <p>
            A personal token is a new way to raise funds for your endeavors and projects! It’s hard to make money during the early stages of a career as an artist or independent creator - we know this from experience. But in a globally connected market there are going to be some people who appreciate what you do, believe in your long term success and have some money to spare. A personal token gives these people a new way of supporting you: Instead of just sending you a donation as on existing crowdfunding platforms like Patreon or kickstarter, they can invest in your work by buying your token. When you become successful the value of this token goes up and your early backers can then sell it again at a higher price. Thus, with a personal token the people who support you when you most need it, get something in return: a share in your personal success.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>What can I do to make my token valuable?</h1>
          <p>
            Like any other asset, your own digital coin only becomes valuable when there are people who want to have it and are willing to give something for it. For this to happen you need to back your coin with something valuable that you can provide in exchange for it. There needs to be something that people can get from you using this token in the future. You are completely free to decide what value that is. As an early stage creator your creations and services might not be valuable to most people yet, but it is enough to offer a service that your investors expect to become valuable in the future. As long as you can make your investors trust that you will honor your commitment and actually provide the promised service when they pay you with your coin, the markets will come to see the coin as representing that value. For example you can say that 1 of your personal tokens can be redeemed for 1 hour of your work as a freelancer. As an artist you can offer a piece of work for 1 token – even when you have not created that piece of work yet. Many people have already done this and raised funds in this way. Check out the next section for some examples.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>Are there already examples of successful personal tokens?</h1>
          <p>
            The technology that makes tokens possible - the blockchain - is still nascent but many people have already leveraged it to launch their own tokens and raise money for their personal creations: <a href="http://bentyn.me/" target="_blank">Sczcepan Bentyn</a> is a YouTuber who launched a token that can be used to influence his content, <a href="https://tokens.harmvandendorpel.com/wildcard-tokens" target="_blank">Harm van der Dorpel</a> has a token that can be redeemed for paintings by him, the <a href="https://jlt.ltd/" target="_blank">Jonas Lund Token</a> gives its holder voting power over his artistic decisions, <a href="https://dappboi.com/" target="_blank">DappBoi</a> has a token that can be used to purchase an hour of his professional design consulting service, and there are many more. All these people are blockchain experts with specific technical skills - it’s not that easy for anyone else to launch a token. And yet, these tokens are flawed because there are usually not enough buyers and sellers for a market price to emerge. Convergent adds three things: First, it enables you to launch your own token without any technical background. Second, it creates a platform where people who are interested in investing and launching tokens can find each other easily. And last but not least, it introduces a new kind of token that is immediately liquid and easily tradable even when only a handful of people are initially interested in it.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>Why blockchain?</h1>
          <p>
            Blockchain is a technology that allows you to raise money directly from your supporters. There is no bank, company or other central intermediary involved (including Convergent) that takes a cut out of your revenue. If you launch a personal token, you are the sole owner of your funds and no one can censor your work or shut down your fundraising. Similarly, for your supporters the blockchain offers an easy way to buy and sell the token directly on a global marketplace without navigating complex financial institutions. And finally, blockchain allows your token to be programmed in such a way that it perfectly suits your needs while being governed by transparent and fair rules. On the blockchain everyone can see exactly how many tokens exist and how they are getting created so you cannot pull any sketchy moves to defraud your investors.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>Is this an ICO?</h1>
          <p>
            No. An ICO usually means selling a fixed amount of tokens at a price you determined, pocketing all the revenue and then letting your investors freely trade the token on exchange platforms. This would not work well for personal tokens for two reasons: First, most individuals will never experience enough people buying and selling their tokens at the same time so that there will be no exchange platforms where people can trade it. Second, you as the creator could easily just take all the money from an ICO and run away with it (this routinely happens even with ICOs of big companies). Therefore, we are using a new generation of token minting mechanisms: an automatic market maker using a so-called bonding curve. With a bonding curve when someone buys a token, they actually just lock their money up in a reserve pool. Only a small part of that reserve pool goes to you as the creator (10% is the default at the moment). The rest stays there in order to give money back to people who want to sell their token again. Thus, people can always buy and sell the token, not just during the initial launch phase. However, and this is why we call it a curve, the price for 1 token can increase and decrease depending on how popular your token is.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>Who sets the price of my token?</h1>
          <p>
            The automatic market maker is a piece of software code, that predictably increases the price of one new token depending on how many tokens have already been bought (TOKEN_SUPPLY). When demand is high your token becomes more expensive automatically. When someone sells their token back to that automatic market maker, the price decreases again. In this way, even when only a handful of supporters are interested in the token, they can already see real money returns on investment when it becomes more popular. Currently we are using the following simple price formula for the bonding curve:
            P = 1/10000 * TOKEN_SUPPLY
            So with every new token that is bought the price goes up by 1/100000. And whenever a token is sold back, the price decreases again by the same amount.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>What are the costs of launching my token?</h1>
          <p>
            During this early stage we do not impose any cost on launching your personal bonding curve token. You can use all features of this platform completely free of charge. However, there is a general, one-time transaction fee that needs to be paid for writing anything on a blockchain. Writing all the necessary information for your personal token currently costs around 1.50 Euro (to be paid in Ether, the cryptocurrency of the blockchain that we are using). This money does not go to us but rather to a global network of people who keep the blockchain running with their computers and hard drives. Make sure you have a little bit of Ether to cover this cost.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>What if I want to change my token?</h1>
          <p>
            When you write something onto the blockchain it cannot be removed again. But of course, you might want to add information later on or maybe you even change your mind about it altogether. Many years from now, you might not be able to offer the same service to your investors that you are promising today. And no one can force you to stick to the same deal forever. For all these reasons, the token allows you to update the associated services and other information about yourself and your work. However, it helps build trust among your supporters if you do not change the pricing and service offering too much when there is no good reason. On a related note, we are also using the latest smart contracts upgradeability standards to make sure that we can update the code of your token when we find a critical bug or possible improvements. We will notify you in these situations and you will be the one to take the final decision on whether you want to opt into an upgrade we suggest or not.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>What's up with the loading times?</h1>
          <p>
            Convergent is a completely decentralized application, which means that the infrastructure runs on the Ethereum blockchain and the InterPlanetary FileSystem (IPFS). IPFS, a peer-to-peer storage solution is used to keep all the application data. This means that there is no central server which holds all the data, but the tradeoff is that it takes a bit longer to retrieve the data the first time you visit the page. After the data loads once it will be cached in your browser so that it doesn't take so long next time.
          </p>
        </FAQItem>
        <FAQItem>
          <h1>How can I find out more about how this work behind the scenes?</h1>
          <p>
            This project is entirely open source so you can see all the <a href="https://github.com/convergentcx" target="_blank">code</a> that is under the hood. We also engage with each of your individual questions on our <a href="https://discordapp.com/invite/JUPx5Xg" target="_blank">discord chat</a>. And you can find more detailed technical as well as abstract write-ups on our <a href="https://medium.com/convergentcx" target="_blank">Medium</a> blog. Also feel free to follow our updates on the social media channels listed on the main website. We are two very approachable dudes that are enthusiastic about decentralized technology and how it can improve life for creators and entrepreneurs. We are always extremely happy to connect and get feedback, also in the real world if you are ever near Berlin!
          </p>
        </FAQItem>
        <TermsButton onClick={() => this.setState({ showTerms: !this.state.showTerms })}>TERMS</TermsButton>
        {
          this.state.showTerms &&
          <div style={{ width: '80%', fontSize: '10px' }}>
            {Terms}
          </div>
        }
      </FAQContainer>
    )
  }
};

export default FAQPage;
