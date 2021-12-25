from datetime import datetime
from dataclasses import dataclass, field
from dataclasses_json import dataclass_json
import time
from nuztrack.enums import Genders

@dataclass_json
@dataclass
class A:
    x: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d:%H-%M-%S"))


@dataclass
class _B:
    y: str
    z: int
    g: Genders = Genders.NEUTRAL


@dataclass
class B(A, _B):
    pass


b=B(y="1",z=1,g=Genders.MALE)

print(repr(b.to_json()))
print(B.from_dict(b.to_dict()))