type SocialConfig = { url: string; name: string; iconPath: string };

function createSocialConfig(name: string, url: string): SocialConfig {
  return {
    name,
    url,
    iconPath: `/images/social/${name.toLowerCase()}.svg`,
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig("Github", "https://github.com/darwinia-network"),
  createSocialConfig("Twitter", "https://twitter.com/DarwiniaNetwork"),
  createSocialConfig("Medium", "https://medium.com/darwinianetwork"),
  createSocialConfig("Telegram", "https://t.me/DarwiniaNetwork"),
  createSocialConfig("Discord", "https://discord.com/invite/VcYFYETrw5"),
  createSocialConfig(
    "Element",
    "https://app.element.io/#/room/#darwinia:matrix.org"
  ),
  createSocialConfig("Email", "mailto:hello@darwinia.network"),
];
